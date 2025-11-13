const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withSigningConfigPlugin(config, options = {}) {
  return withAppBuildGradle(config, (cfg) => {
    if (process.env.SIGNING_LOCAL !== "true") return cfg;

    let src = cfg.modResults.contents;

    if (!options.keystorePath) {
      throw new Error("@secullum/expo-android-signing: 'keystorePath' é obrigatório");
    }
    
    if (!options.keyAlias) {
      throw new Error("@secullum/expo-android-signing: 'keyAlias' é obrigatório");
    }

    if (!options.storePassword) {
      throw new Error("@secullum/expo-android-signing: 'storePassword' é obrigatório");
    }

    if (!options.keyPassword) {
      throw new Error("@secullum/expo-android-signing: 'keyPassword' é obrigatório");
    }

    const KEYSTORE_REL = options.keystorePath;
    const ALIAS = options.keyAlias;
    const STORE_PW = options.storePassword;
    const KEY_PW = options.keyPassword;

    const SIGNING_BLOCK =
`    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            storeFile file("${KEYSTORE_REL}")
            storePassword "${STORE_PW}"
            keyAlias "${ALIAS}"
            keyPassword "${KEY_PW}"
        }
    }`;

    // Substituição do 'signingConfigs' pelo bloco 'SIGNING_BLOCK' até antes do 'buildTypes'
    const signingConfigsIndex = src.indexOf("signingConfigs");
    const buildTypesIndex = src.indexOf("buildTypes", signingConfigsIndex !== -1 ? signingConfigsIndex : 0);

    src = src.slice(0, signingConfigsIndex) + SIGNING_BLOCK + "\n    " + src.slice(buildTypesIndex);

    // Substiuição no 'buildTypes' para usar 'signingConfigs.release' e fazer com que nosso bloco de
    // keystore funcione
    src = src.replace(
      /(buildTypes\s*{[\s\S]*?release\s*{)([\s\S]*?)(\n\s*})/m,
      (_m, open, body, close) => {
        // Explicação da regex:
        // Cada parte entre parenteses é capturada em um grupo:
        // 1. (buildTypes\s*{[\s\S]*?release\s*{) = open e captura desde o 
        // início do bloco `buildTypes {` até o `release {`.
        // 2. ([\s\S]*?) = body e captura o conteúdo dentro do bloco `release { ... }`.
        // 3. (\n\s*}) = close e captura o fechamento da chave `}` do bloco release.

        // Remove qualquer signingConfig anterior
        let inner = body.replace(/^\s*signingConfig\s+signingConfigs\.\w+\s*$/gm, "");
       
        // injeta a configuração de release
        inner = `\n            signingConfig signingConfigs.release` + inner;

        return open + inner + close;
      }
    );

    cfg.modResults.contents = src;

    return cfg;
  });
};
