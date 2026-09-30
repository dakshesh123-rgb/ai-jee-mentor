import {
  AuthClient,
  type AuthClientCreateOptions,
  type AuthClientLoginOptions,
} from "@dfinity/auth-client";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import type { Identity } from "@icp-sdk/core/agent";
import { DelegationIdentity, isDelegationValid } from "@icp-sdk/core/identity";
import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadConfig } from "../config";

export type Status =
  | "initializing"
  | "idle"
  | "logging-in"
  | "success"
  | "loginError";

export type InternetIdentityContext = {
  /** The identity is available after successfully loading the identity from local storage
   * or completing the login process. */
  identity?: Identity;

  /** Connect to Internet Identity to login the user. */
  login: () => void;

  /** 1-click instant student account login (reliable across all mobile browsers & webviews). */
  loginAsStudent: (name?: string) => void;

  /** Display name if logged in as student */
  studentName?: string;

  /** Clears the identity from the state and local storage. Effectively "logs the user out". */
  clear: () => void;

  /** The loginStatus of the login process. */
  loginStatus: Status;

  /** `loginStatus === "initializing"` */
  isInitializing: boolean;

  /** `loginStatus === "idle"` */
  isLoginIdle: boolean;

  /** `loginStatus === "logging-in"` */
  isLoggingIn: boolean;

  /** `loginStatus === "success"` */
  isLoginSuccess: boolean;

  /** `loginStatus === "loginError"` */
  isLoginError: boolean;

  loginError?: Error;
};

const ONE_HOUR_IN_NANOSECONDS = BigInt(3_600_000_000_000);
const DEFAULT_IDENTITY_PROVIDER = process.env.II_URL;

type ProviderValue = InternetIdentityContext;
const InternetIdentityReactContext = createContext<ProviderValue | undefined>(
  undefined,
);

/**
 * Create the auth client with default options or options provided by the user.
 * Gracefully handles missing canister IDs on Cloudflare edge deployments.
 */
async function createAuthClient(
  createOptions?: AuthClientCreateOptions,
): Promise<AuthClient> {
  let ii_derivation_origin: string | undefined = undefined;
  try {
    const config = await loadConfig();
    if (config?.ii_derivation_origin && config.ii_derivation_origin !== "undefined") {
      ii_derivation_origin = config.ii_derivation_origin;
    }
  } catch {
    // Non-canister edge runtime
  }

  const options: AuthClientCreateOptions = {
    idleOptions: {
      disableDefaultIdleCallback: true,
      disableIdle: true,
      ...createOptions?.idleOptions,
    },
    ...(ii_derivation_origin
      ? { loginOptions: { derivationOrigin: ii_derivation_origin } }
      : {}),
    ...createOptions,
  };
  const authClient = await AuthClient.create(options);
  return authClient;
}

function assertProviderPresent(
  context: ProviderValue | undefined,
): asserts context is ProviderValue {
  if (!context) {
    throw new Error(
      "InternetIdentityProvider is not present. Wrap your component tree with it.",
    );
  }
}

export const useInternetIdentity = (): InternetIdentityContext => {
  const context = useContext(InternetIdentityReactContext);
  assertProviderPresent(context);
  return context;
};

export function InternetIdentityProvider({
  children,
  createOptions,
}: PropsWithChildren<{
  children: ReactNode;
  createOptions?: AuthClientCreateOptions;
}>) {
  const [authClient, setAuthClient] = useState<AuthClient | undefined>(undefined);
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [studentName, setStudentName] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem("jee_student_name") || undefined;
    } catch {
      return undefined;
    }
  });
  const [loginStatus, setStatus] = useState<Status>("initializing");
  const [loginError, setError] = useState<Error | undefined>(undefined);

  const setErrorMessage = useCallback((message: string) => {
    setStatus("loginError");
    setError(new Error(message));
  }, []);

  const loginAsStudent = useCallback((name?: string) => {
    try {
      setStatus("logging-in");
      const chosenName = name?.trim() || "JEE Aspirant";
      let studentIdentity: Identity;

      const existingKey = localStorage.getItem("jee_student_key");
      if (existingKey) {
        try {
          studentIdentity = Ed25519KeyIdentity.fromJSON(existingKey);
        } catch {
          const newKey = Ed25519KeyIdentity.generate();
          localStorage.setItem("jee_student_key", JSON.stringify(newKey.toJSON()));
          studentIdentity = newKey;
        }
      } else {
        const newKey = Ed25519KeyIdentity.generate();
        localStorage.setItem("jee_student_key", JSON.stringify(newKey.toJSON()));
        studentIdentity = newKey;
      }

      localStorage.setItem("jee_student_name", chosenName);
      setStudentName(chosenName);
      setIdentity(studentIdentity);
      setStatus("success");
      setError(undefined);
    } catch (err) {
      setStatus("loginError");
      setError(
        err instanceof Error ? err : new Error("Failed to activate student account"),
      );
    }
  }, []);

  const login = useCallback(async () => {
    try {
      setStatus("logging-in");
      setError(undefined);

      let client = authClient;
      if (!client) {
        client = await createAuthClient(createOptions);
        setAuthClient(client);
      }

      const currentIdentity = client.getIdentity();
      if (
        !currentIdentity.getPrincipal().isAnonymous() &&
        currentIdentity instanceof DelegationIdentity &&
        isDelegationValid(currentIdentity.getDelegation())
      ) {
        setIdentity(currentIdentity);
        setStatus("success");
        return;
      }

      const identityProvider =
        DEFAULT_IDENTITY_PROVIDER && DEFAULT_IDENTITY_PROVIDER !== "undefined"
          ? DEFAULT_IDENTITY_PROVIDER
          : "https://identity.internetcomputer.org";

      const options: AuthClientLoginOptions = {
        identityProvider,
        onSuccess: () => {
          const latestIdentity = client?.getIdentity();
          if (latestIdentity) {
            setIdentity(latestIdentity);
            try {
              localStorage.removeItem("jee_student_key");
            } catch {}
            setStatus("success");
          }
        },
        onError: (maybeError?: string) => {
          setErrorMessage(maybeError ?? "Login failed");
        },
        maxTimeToLive: ONE_HOUR_IN_NANOSECONDS * BigInt(24 * 30), // 30 days
      };

      await client.login(options);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to initialize login service",
      );
    }
  }, [authClient, createOptions, setErrorMessage]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem("jee_student_key");
      localStorage.removeItem("jee_student_name");
    } catch {}

    setStudentName(undefined);
    setIdentity(undefined);
    setStatus("idle");
    setError(undefined);

    if (authClient) {
      void authClient.logout().catch(() => {});
    }
  }, [authClient]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setStatus("initializing");
        let existingClient = authClient;
        if (!existingClient) {
          existingClient = await createAuthClient(createOptions);
          if (cancelled) return;
          setAuthClient(existingClient);
        }
        const isAuthenticated = await existingClient.isAuthenticated();
        if (cancelled) return;
        if (isAuthenticated) {
          const loadedIdentity = existingClient.getIdentity();
          setIdentity(loadedIdentity);
        } else {
          // Restore student key identity if user previously logged in as student
          try {
            const savedStudentKey = localStorage.getItem("jee_student_key");
            if (savedStudentKey) {
              const restoredId = Ed25519KeyIdentity.fromJSON(savedStudentKey);
              setIdentity(restoredId);
            }
          } catch {}
        }
      } catch (unknownError) {
        setStatus("loginError");
        setError(
          unknownError instanceof Error
            ? unknownError
            : new Error("Initialization failed"),
        );
      } finally {
        if (!cancelled) setStatus("idle");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [createOptions, authClient]);

  const value = useMemo<ProviderValue>(
    () => ({
      identity,
      login,
      loginAsStudent,
      studentName,
      clear,
      loginStatus,
      isInitializing: loginStatus === "initializing",
      isLoginIdle: loginStatus === "idle",
      isLoggingIn: loginStatus === "logging-in",
      isLoginSuccess: loginStatus === "success",
      isLoginError: loginStatus === "loginError",
      loginError,
    }),
    [identity, login, loginAsStudent, studentName, clear, loginStatus, loginError],
  );

  return createElement(InternetIdentityReactContext.Provider, {
    value,
    children,
  });
}
