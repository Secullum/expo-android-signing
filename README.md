# expo-android-signing

Expo Config Plugin para configurar assinatura Android localmente com keystore customizada.

## Instalação

```bash
yarn add expo-android-signing
```

ou

```bash
npm install expo-android-signing
```

## Uso

No seu `app.json` ou `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-android-signing",
        {
          "keystorePath": "../../caminho/para/seu.keystore",
          "keyAlias": "seu-alias",
          "storePassword": "sua-senha-store",
          "keyPassword": "sua-senha-key"
        }
      ]
    ]
  }
}
```

**Todos os parâmetros são obrigatórios.**

## Variável de ambiente

O plugin só será aplicado quando a variável de ambiente `SIGNING_LOCAL=true` estiver definida:

```bash
SIGNING_LOCAL=true npx expo prebuild --clean
```

## Opções

Todas as opções são **obrigatórias**:

| Opção | Tipo | Descrição |
|-------|------|-----------|
| `keystorePath` | `string` | Caminho relativo para o arquivo keystore |
| `keyAlias` | `string` | Alias da chave no keystore |
| `storePassword` | `string` | Senha do keystore |
| `keyPassword` | `string` | Senha da chave |

## Desenvolvimento

### Publicar uma nova versão no npm

1. Atualizar a versão no `package.json`:

```bash
npm version patch  # para 1.0.0 -> 1.0.1
npm version minor  # para 1.0.0 -> 1.1.0
npm version major  # para 1.0.0 -> 2.0.0
```

2. Publicar no npm:

```bash
npm publish
```

3. Fazer push das tags para o repositório:

```bash
git push --follow-tags
```

## Licença

MIT
