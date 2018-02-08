export class ConfirmModalSetting {
  title?: string;
  content: string;
  confirmCallback?: (message?: string) => void = null;
  messageBox?: boolean;
  messageRequire?: boolean;
}
