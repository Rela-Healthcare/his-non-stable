export class MomentPay {
  private iframe: HTMLIFrameElement | null = null;
  private modal: HTMLDivElement | null = null;
  private responseCallback: ((data: any) => void) | null = null;
  private closeCallback: (() => void) | null = null;
  private static spinnerStylesInjected = false;

  constructor() {
    this._handleMessage = this._handleMessage.bind(this);
  }

  init(options: Record<string, any>): void {
    // Cleanup existing modal if present
    this.close();

    // Inject spinner keyframes once
    if (!MomentPay.spinnerStylesInjected) {
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      MomentPay.spinnerStylesInjected = true;
    }

    // Create form with hidden inputs
    const form = document.createElement('form');
    form.method = 'post';
    form.action = options.actionUrl;
    form.target = 'momentPayFrame';

    Object.entries(options).forEach(([key, value]) => {
      if (key !== 'actionUrl' && value !== undefined) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    });

    // Create modal container
    this.modal = document.createElement('div');
    this.modal.style.cssText = `
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
      position: relative;
      width: 100%;
      max-width: 750px;
      height: 95%;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
    `;

    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      font-size: 18px;
      font-weight: 500;
      color: #1f2937;
      transition: opacity 0.3s ease;
    `;
    loadingOverlay.setAttribute('role', 'status');
    loadingOverlay.setAttribute('aria-live', 'polite');

    loadingOverlay.innerHTML = `
      <div style="text-align:center;">
        <div style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: auto;
        "></div>
        <p style="margin-top: 10px;">Loading Payment Gateway...</p>
      </div>
    `;

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: #eee;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 16px;
      line-height: 30px;
      text-align: center;
    `;
    closeButton.onclick = () => this.close();

    // Create iframe
    this.iframe = document.createElement('iframe');
    this.iframe.name = 'momentPayFrame';
    this.iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;

    // Handle iframe load to remove loading screen
    this.iframe.onload = () => {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.remove(), 300); // fade-out
    };

    // Assemble DOM elements
    iframeContainer.appendChild(loadingOverlay);
    iframeContainer.appendChild(this.iframe);
    iframeContainer.appendChild(closeButton);
    this.modal.appendChild(iframeContainer);
    document.body.appendChild(this.modal);
    document.body.appendChild(form);

    // Submit and cleanup form
    form.submit();
    setTimeout(() => document.body.removeChild(form), 100);

    // Add event listeners
    window.addEventListener('message', this._handleMessage);
    window.addEventListener('keydown', this._handleEscapeKey);
  }

  private _handleMessage(event: MessageEvent): void {
    try {
      let responseData: any;

      if (typeof event.data === 'string') {
        try {
          responseData = JSON.parse(event.data);
        } catch (e) {
          console.error('Failed to parse message data:', event.data);
          return;
        }
      } else if (typeof event.data === 'object') {
        responseData = event.data;
      } else {
        return;
      }

      if (this.responseCallback) {
        if (responseData.type === 'momentPayResponse') {
          this.responseCallback(responseData.payload);
        } else if (responseData.response_token) {
          this.responseCallback(responseData);
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
    } finally {
      this.close();
    }
  }

  private _handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  onResponse(callback: (data: any) => void): void {
    this.responseCallback = callback;
  }

  onClose(callback: () => void): void {
    this.closeCallback = callback;
  }

  close(): void {
    if (this.modal) {
      document.body.removeChild(this.modal);
      this.modal = null;
      this.iframe = null;
      window.removeEventListener('message', this._handleMessage);
      window.removeEventListener('keydown', this._handleEscapeKey);

      if (this.closeCallback) {
        this.closeCallback();
      }
    }
  }
}
