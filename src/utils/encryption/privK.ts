export class AEM2 {
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

  // Function to encrypt a message with the public key
  static async encryptMessage(message: string) {
    const publicKeyData = localStorage.getItem("publicKey");
    if (!publicKeyData) {
      throw new Error("No public key found. Generate key pair first.");
    }

    const chunks = this.calculateStringChunks(message);

    // Import the public key from LocalStorage
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      this._base64ToArrayBuffer(publicKeyData),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    // Convert message to ArrayBuffer
    const enc = new TextEncoder();
    // const messageBuffer = enc.encode(message);

    const messageBuffers = [];
    for (let chunk of chunks) {
      const chunkBuffer = enc.encode(chunk);
      messageBuffers.push(chunkBuffer);
    }

    // Encrypt the message
    // const encryptedMessage = await window.crypto.subtle.encrypt(
    //   { name: "RSA-OAEP" },
    //   publicKey,
    //   messageBuffer
    // );

    const encryptedChunks = [];
    for (let messageBuffer of messageBuffers) {
      const encryptedMessage = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        messageBuffer
      );
      encryptedChunks.push(encryptedMessage);
    }

    const chipherTexts = [];
    for (let encryptedChunk of encryptedChunks) {
      const chipherText = this._arrayBufferToBase64(encryptedChunk);
      chipherTexts.push(chipherText);
    }

    // Convert encrypted message to Base64 and store it
    // const cipherText = this._arrayBufferToBase64(encryptedMessage);
    // localStorage.setItem("cipheredMessage", cipherText);

    localStorage.setItem("cipheredMessage", JSON.stringify(chipherTexts));
    console.log("Encrypted message stored in LocalStorage");
    console.log(chipherTexts);
    return chipherTexts; // Return the ciphered string
  }

  // Function to decrypt the ciphered message with the private key
  static async decryptMessage() {
    const privateKeyData = localStorage.getItem("privateKey");
    const cipherText = localStorage.getItem("cipheredMessage");

    const cipherTexts = cipherText ? JSON.parse(cipherText) : [];

    if (!privateKeyData || !cipherText) {
      throw new Error(
        "Missing private key or ciphered message in LocalStorage."
      );
    }

    // Import the private key from LocalStorage
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      this._base64ToArrayBuffer(privateKeyData),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );

    // Convert the Base64 ciphered message to ArrayBuffer
    // const encryptedMessageBuffer = this._base64ToArrayBuffer(cipherText);

    const encryptedMessageBuffers = [];
    for (let cipherText of cipherTexts) {
      const encryptedMessageBuffer = this._base64ToArrayBuffer(cipherText);
      encryptedMessageBuffers.push(encryptedMessageBuffer);
    }

    // Decrypt the message
    const decryptedChunks = [];
    for (let encryptedMessageBuffer of encryptedMessageBuffers) {
      const decryptedMessage = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedMessageBuffer
      );
      decryptedChunks.push(decryptedMessage);
    }

    // const decryptedMessage = await window.crypto.subtle.decrypt(
    //   { name: "RSA-OAEP" },
    //   privateKey,
    //   encryptedMessageBuffer
    // );

    // Convert ArrayBuffer to string
    const dec = new TextDecoder();
    const originalMessageChunks = [];
    for (let originalMessageChunk of decryptedChunks) {
      const originalMessage = dec.decode(originalMessageChunk);
      originalMessageChunks.push(originalMessage);
    }
    // const originalMessage = dec.decode(decryptedMessage);

    const originalMessage = originalMessageChunks.join("");

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

  static calculateStringChunks(string: string, chunkSize = 128) {
    const chunks = [];
    for (let i = 0; i < string.length; i += chunkSize) {
      chunks.push(string.substring(i, i + chunkSize));
    }
    console.log(chunks);
    return chunks;
  }
}

// Example Usage:
// Generate key pair
// await AsymmetricEncryptionManager.generateKeyPair();

// Encrypt a message
// const cipherText = await AsymmetricEncryptionManager.encryptMessage("Hello World!");

// Decrypt the message
// const originalMessage = await AsymmetricEncryptionManager.decryptMessage();
