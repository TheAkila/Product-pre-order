declare module 'textlk-node' {
  interface SendSMSOptions {
    phoneNumber: string;
    message: string;
    apiToken?: string;
    senderId?: string;
  }

  interface SendSMSResponse {
    status: string;
    message: string;
    data?: {
      uid: string;
      to: string;
      from: string;
      message: string;
      status: string;
      cost: string;
      sms_count: number;
    };
    error?: string;
  }

  export function sendSMS(options: SendSMSOptions): Promise<SendSMSResponse>;
}
