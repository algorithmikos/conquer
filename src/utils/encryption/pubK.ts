import CryptoJS from "crypto-js";

// Encrypt a message using a shared secret key
export const encryptMessage = (message: string, secretKey: string) => {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
};

// Decrypt the encrypted message using the same secret key
export const decryptMessage = (encryptedMessage: string, secretKey: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const generateSecretKey = () => {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
};

export const hashPassword = (password: string) => {
  return CryptoJS.SHA256(password).toString();
};

////

export class AsymmetricEncryptionManager {
  // Function to generate RSA key pair and store them in LocalStorage
  static async generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Export and store public and private keys in LocalStorage
    const publicKey = await window.crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    const privateKey = await window.crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );

    // Convert to Base64 for storage in LocalStorage
    localStorage.setItem("publicKey", this._arrayBufferToBase64(publicKey));
    localStorage.setItem("privateKey", this._arrayBufferToBase64(privateKey));

    console.log("Keys generated and stored in LocalStorage");
  }

  // Function to encrypt a large message with hybrid encryption (AES + RSA)
  static async encryptMessage(message: string) {
    const publicKeyData = localStorage.getItem("publicKey");
    if (!publicKeyData) {
      throw new Error("No public key found. Generate key pair first.");
    }

    // Import the public key from LocalStorage
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      this._base64ToArrayBuffer(publicKeyData),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    // Step 1: Generate a random AES key for encrypting the message
    const aesKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    // Step 2: Encrypt the message with the AES key
    const enc = new TextEncoder();
    const messageBuffer = enc.encode(message);
    const iv = localStorage.getItem("aesIV")
      ? // @ts-ignore
        this._base64ToArrayBuffer(localStorage.getItem("aesIV"))
      : window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector for AES-GCM

    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      messageBuffer
    );

    // Step 3: Export the AES key and encrypt it with the RSA public key
    const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
    const encryptedAesKey = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      exportedAesKey
    );

    // Step 4: Store the encrypted message and AES key in LocalStorage (both are Base64 encoded)
    localStorage.setItem(
      "cipheredMessage",
      this._arrayBufferToBase64(encryptedMessage)
    );
    localStorage.setItem(
      "encryptedAesKey",
      this._arrayBufferToBase64(encryptedAesKey)
    );
    localStorage.setItem("aesIV", this._arrayBufferToBase64(iv));

    return this._arrayBufferToBase64(encryptedMessage); // Return the ciphered string
  }

  // Function to decrypt the ciphered message with the private key (hybrid decryption)
  static async decryptMessage() {
    const privateKeyData = localStorage.getItem("privateKey");
    const cipherText = localStorage.getItem("cipheredMessage");
    const encryptedAesKey = localStorage.getItem("encryptedAesKey");
    const ivData = localStorage.getItem("aesIV");

    if (!privateKeyData || !cipherText || !encryptedAesKey || !ivData) {
      throw new Error("Missing data in LocalStorage.");
    }

    // Import the private key from LocalStorage
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      this._base64ToArrayBuffer(privateKeyData),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );

    // Step 1: Decrypt the AES key with the private RSA key
    const decryptedAesKeyBuffer = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      this._base64ToArrayBuffer(encryptedAesKey)
    );

    // Step 2: Import the decrypted AES key for further decryption
    const aesKey = await window.crypto.subtle.importKey(
      "raw",
      decryptedAesKeyBuffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // Step 3: Decrypt the ciphered message with the AES key
    const encryptedMessageBuffer = this._base64ToArrayBuffer(cipherText);
    const iv = this._base64ToArrayBuffer(ivData);

    const decryptedMessage = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encryptedMessageBuffer
    );

    // Convert ArrayBuffer to string
    const dec = new TextDecoder();
    const originalMessage = dec.decode(decryptedMessage);

    localStorage.setItem("decryptedMessage", originalMessage); // Store decrypted message

    return originalMessage; // Return the decrypted string
  }

  // Helper: Convert ArrayBuffer to Base64 string
  static _arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Helper: Convert Base64 string to ArrayBuffer
  static _base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Example Usage:
// await AsymmetricEncryptionManager.generateKeyPair();
// const cipherText = await AsymmetricEncryptionManager.encryptMessage("Hello World!");
// const originalMessage = await AsymmetricEncryptionManager.decryptMessage();
