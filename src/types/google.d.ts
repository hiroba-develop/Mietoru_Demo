// Google Identity Services用の型定義
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          prompt: (
            callback?: (notification: PromptMomentNotification) => void
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: GsiButtonConfiguration
          ) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: {
            id: string;
            password: string;
          }) => void;
          cancel: () => void;
          onGoogleLibraryLoad: () => void;
          revoke: (
            hint: string,
            callback: (done: RevocationResponse) => void
          ) => void;
        };
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => GoogleTokenClient;
          hasGrantedAnyScope: (
            tokenResponse: TokenResponse,
            firstScope: string,
            ...restScopes: string[]
          ) => boolean;
          hasGrantedAllScopes: (
            tokenResponse: TokenResponse,
            firstScope: string,
            ...restScopes: string[]
          ) => boolean;
          revoke: (accessToken: string, callback?: () => void) => void;
        };
      };
    };
  }
}

interface GoogleIdConfiguration {
  client_id: string;
  auto_select?: boolean;
  callback: (response: google.accounts.id.CredentialResponse) => void;
  login_uri?: string;
  native_callback?: (response: google.accounts.id.CredentialResponse) => void;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: string;
  state_cookie_domain?: string;
  ux_mode?: string;
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: () => void;
  use_fedcm_for_prompt?: boolean;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () =>
    | "browser_not_supported"
    | "invalid_client"
    | "missing_client_id"
    | "opt_out_or_no_session"
    | "secure_http_required"
    | "suppressed_by_user"
    | "unregistered_origin"
    | "unknown_reason";
  isSkippedMoment: () => boolean;
  getSkippedReason: () =>
    | "auto_cancel"
    | "user_cancel"
    | "tap_outside"
    | "issuing_failed";
  isDismissedMoment: () => boolean;
  getDismissedReason: () =>
    | "credential_returned"
    | "cancel_called"
    | "flow_restarted";
  getMomentType: () => "display" | "skipped" | "dismissed";
}

interface GsiButtonConfiguration {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: string;
  locale?: string;
  click_listener?: () => void;
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback?: (response: TokenResponse) => void;
  error_callback?: (error: GoogleTokenError) => void;
  state?: string;
  enable_granular_consent?: boolean;
  login_hint?: string;
  hd?: string;
}

interface GoogleTokenClient {
  requestAccessToken: (overrideConfig?: Partial<TokenClientConfig>) => void;
}

interface TokenResponse {
  access_token: string;
  authuser: string;
  expires_in: number;
  prompt: string;
  scope: string;
  token_type: string;
}

interface GoogleTokenError {
  type: string;
}

interface RevocationResponse {
  successful: boolean;
  error?: string;
}

declare namespace google.accounts.id {
  interface CredentialResponse {
    credential: string;
    select_by: string;
  }
}

export {};
