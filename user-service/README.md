# .env FILE

```

# NODE
NODE_ENV=

# SERVER
SERVER_HOST=
SERVER_PORT=

# DATABASE
MONGO_URI=

# CORS
ALLOWED_ORIGINS=

# COOKIE
COOKIE_SECRET=

# JWT
JWT_REFRESH_SECRET=

# REDIS
REDIS_HOST=
REDIS_PORT=



```

---

# GENERATE PUBLIC & PRIVATE KEYS FOR JWT ACCESS TOKEN USING RS256 ALGORITHM

Generate private & public keys in root directory of **USER SERVICE**

## Private Key

```bash

# Private Key
openssl genrsa -out access-private.pem 2048

```

## Public Key

```bash

# Public Key
openssl rsa -in access-private.pem -pubout -out access-public.pem

```

Move the **_access-public.pem_** public key file to root directory of **API GATEWAY**.

---
