const argon2 = require("argon2");
const crypto = require('crypto');
let original = 'myPassword';
let test = "somePassword";

let main = async () => {

  function encryptTmp(password) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password);
    return cipher.final();
  }

  try {
    let originalEncrypted = await encryptTmp(original);
    const hash = await argon2.hash(originalEncrypted);
    console.log("Password: %s hashed", original);
    try {
      let testEncrypted = await encryptTmp(test);
      console.log("Compare password %s to %s", test, original);
      if (await argon2.verify(hash, testEncrypted)) {
        // password match
        console.log("Match: true");
      } else {
        // password did not match
        console.log("Match: false");
      }
    } catch (firstCompareErr) {}
    try {
      console.log("Compare password %s to %s", original, original);
      if (await argon2.verify(hash, originalEncrypted)) {
        // password match
        console.log("Match: true");
      } else {
        // password did not match
        console.log("Match: false");
      }
    } catch (secondCompareErr) {}
  } catch (hashErr) {}
}

main();
