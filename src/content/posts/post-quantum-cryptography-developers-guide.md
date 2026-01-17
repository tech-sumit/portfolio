---
title: "Post-Quantum Cryptography: What Developers Need to Know Now"
date: 2026-01-17T14:00:00.000Z
description: "Quantum computers will break current encryption. Learn about post-quantum cryptography (PQC), NIST-approved algorithms, and how to prepare your applications for the quantum threat."
tags:
  - post-quantum-cryptography
  - pqc
  - quantum-computing
  - cybersecurity
  - encryption
  - cryptography
  - nist
  - security
  - ml-kem
  - ml-dsa
---

## TL;DR - Key Takeaways

1. **Quantum computers will break RSA and ECC** - The encryption protecting most of the internet today
2. **"Harvest now, decrypt later"** - Adversaries are already collecting encrypted data to decrypt when quantum computers arrive
3. **NIST has approved 4 post-quantum algorithms** - ML-KEM, ML-DSA, SLH-DSA, and FN-DSA
4. **Hybrid cryptography** is the recommended transition approach
5. **Start preparing now** - Even if quantum computers are years away, the migration takes time

---

## What Is Post-Quantum Cryptography?

**Post-quantum cryptography (PQC)**, also called quantum-resistant or quantum-safe cryptography, refers to cryptographic algorithms that are secure against attacks by both classical and quantum computers.

### Definition

> **Post-Quantum Cryptography**: Cryptographic systems designed to be secure even if a large-scale quantum computer exists, while still running efficiently on today's classical computers.

### The Quantum Threat

Current public-key cryptography relies on mathematical problems that are hard for classical computers but easy for quantum computers:

| Algorithm | Security Basis | Quantum Vulnerable? |
|-----------|---------------|---------------------|
| RSA | Integer factorization | **Yes** - Shor's algorithm |
| ECC | Discrete logarithm | **Yes** - Shor's algorithm |
| AES-256 | Symmetric encryption | Partially - Grover's (use larger keys) |
| SHA-256 | Hash functions | Partially - Grover's (use larger outputs) |

---

## Why Should Developers Care Now?

### The "Harvest Now, Decrypt Later" Attack

Nation-states and sophisticated attackers are already:

1. **Intercepting encrypted traffic** today
2. **Storing it** in massive data archives
3. **Waiting** for quantum computers to decrypt it

This means sensitive data encrypted today could be exposed in the future:

| Data Type | Sensitivity Duration | Risk Level |
|-----------|---------------------|------------|
| Medical records | 50+ years | **Critical** |
| Government secrets | 25+ years | **Critical** |
| Financial records | 7-10 years | **High** |
| Business communications | 5+ years | **High** |
| Personal messages | Variable | **Medium** |

### Quantum Computing Timeline

| Milestone | Estimated Timeline |
|-----------|-------------------|
| Current largest quantum computers | ~1,000 qubits |
| Break simple encryption | 2028-2030 |
| Break RSA-2048 | 2030-2035 |
| Cryptographically relevant quantum computer | 2030-2040 |

**The problem**: Migrating cryptographic systems takes 5-15 years. If quantum computers arrive in 2030-2035, we need to start now.

---

## NIST Post-Quantum Cryptography Standards

In 2024, NIST (National Institute of Standards and Technology) finalized the first post-quantum cryptographic standards after a 7-year evaluation process.

### The Four Approved Algorithms

| Algorithm | Type | Purpose | Based On |
|-----------|------|---------|----------|
| **ML-KEM** (FIPS 203) | Key Encapsulation | Secure key exchange | CRYSTALS-Kyber |
| **ML-DSA** (FIPS 204) | Digital Signature | Signing/verification | CRYSTALS-Dilithium |
| **SLH-DSA** (FIPS 205) | Digital Signature | Stateless signatures | SPHINCS+ |
| **FN-DSA** (FIPS 206) | Digital Signature | Fast signatures | FALCON |

### Algorithm Deep Dive

#### ML-KEM (Module-Lattice Key Encapsulation Mechanism)

**Use case**: Replacing RSA and ECDH for key exchange

```
Purpose: Establish shared secrets for symmetric encryption
Based on: Module Learning With Errors (MLWE) problem
Security levels: ML-KEM-512, ML-KEM-768, ML-KEM-1024
```

**Key sizes compared to current algorithms**:

| Algorithm | Public Key | Secret Key | Ciphertext |
|-----------|-----------|------------|------------|
| RSA-2048 | 256 bytes | 256 bytes | 256 bytes |
| ECDH P-256 | 64 bytes | 32 bytes | 64 bytes |
| **ML-KEM-768** | 1,184 bytes | 2,400 bytes | 1,088 bytes |

#### ML-DSA (Module-Lattice Digital Signature Algorithm)

**Use case**: Replacing RSA and ECDSA for digital signatures

```
Purpose: Sign and verify documents, code, certificates
Based on: Fiat-Shamir with Aborts over lattices
Security levels: ML-DSA-44, ML-DSA-65, ML-DSA-87
```

#### SLH-DSA (Stateless Hash-Based Digital Signature Algorithm)

**Use case**: High-security applications where larger signatures are acceptable

```
Purpose: Signatures based only on hash functions
Advantage: Different mathematical basis than lattice schemes
Trade-off: Larger signature sizes
```

#### FN-DSA (Fast-Fourier Lattice-Based Signatures)

**Use case**: Applications requiring smaller signatures

```
Purpose: Compact signatures with fast verification
Note: More complex to implement securely
```

---

## Practical Implementation Guide

### Step 1: Inventory Your Cryptographic Usage

Before migrating, understand what you're using:

```bash
# Find RSA usage in codebases
grep -r "RSA" --include="*.py" --include="*.js" --include="*.java"

# Find OpenSSL/crypto library usage
grep -r "crypto\|openssl\|bcrypt" --include="*.py"
```

**Common areas to check**:

| Area | What to Look For |
|------|------------------|
| TLS/HTTPS | Certificate algorithms |
| API authentication | JWT signing (RS256, ES256) |
| Code signing | Package/binary signatures |
| Data encryption | Key exchange mechanisms |
| Password storage | Usually safe (symmetric) |

### Step 2: Implement Hybrid Cryptography

**Hybrid cryptography** combines classical and post-quantum algorithms. If either one is broken, you're still protected by the other.

```python
# Conceptual hybrid key exchange
def hybrid_key_exchange():
    # Classical key exchange (still trusted today)
    classical_shared_secret = ecdh_key_exchange()
    
    # Post-quantum key exchange (future-proof)
    pq_shared_secret = ml_kem_key_exchange()
    
    # Combine both secrets
    final_secret = kdf(classical_shared_secret + pq_shared_secret)
    
    return final_secret
```

### Step 3: Use PQC Libraries

#### Python: liboqs-python

```python
# Install: pip install liboqs-python
import oqs

# Key encapsulation with ML-KEM
with oqs.KeyEncapsulation("ML-KEM-768") as kem:
    # Generate key pair
    public_key = kem.generate_keypair()
    
    # Encapsulate (create shared secret and ciphertext)
    ciphertext, shared_secret_enc = kem.encap_secret(public_key)
    
    # Decapsulate (recover shared secret)
    shared_secret_dec = kem.decap_secret(ciphertext)
```

#### JavaScript/Node.js: liboqs-node

```javascript
// Install: npm install liboqs-node
const oqs = require('liboqs-node');

// Digital signature with ML-DSA
const sig = new oqs.Signature('ML-DSA-65');

// Generate key pair
const publicKey = sig.generateKeyPair();

// Sign a message
const message = Buffer.from('Important document');
const signature = sig.sign(message);

// Verify signature
const isValid = sig.verify(message, signature, publicKey);
```

#### Go: Cloudflare's circl

```go
// go get github.com/cloudflare/circl
import "github.com/cloudflare/circl/kem/mlkem/mlkem768"

// Generate ML-KEM key pair
publicKey, privateKey, _ := mlkem768.GenerateKeyPair(rand.Reader)

// Encapsulate
ciphertext, sharedSecret, _ := mlkem768.Encapsulate(rand.Reader, publicKey)

// Decapsulate
recoveredSecret, _ := mlkem768.Decapsulate(privateKey, ciphertext)
```

---

## Migration Strategy for Organizations

### Phase 1: Assessment (Now)

1. **Inventory all cryptographic assets**
   - TLS certificates
   - VPN configurations
   - API authentication
   - Data-at-rest encryption

2. **Classify data by sensitivity lifespan**
   - What data must remain confidential for 10+ years?

3. **Identify high-priority systems**
   - External-facing services
   - Systems handling sensitive data

### Phase 2: Pilot (2026-2027)

1. **Implement hybrid TLS** on non-critical systems
2. **Test PQC in development environments**
3. **Measure performance impact**
4. **Train development teams**

### Phase 3: Transition (2027-2030)

1. **Migrate high-priority systems** to hybrid cryptography
2. **Update certificate infrastructure**
3. **Implement quantum-safe key management**

### Phase 4: Full Deployment (2030+)

1. **Complete migration** of all systems
2. **Retire classical-only cryptography**
3. **Continuous monitoring** for new threats

---

## Performance Considerations

Post-quantum algorithms are larger and sometimes slower:

### Key and Signature Size Comparison

| Algorithm | Public Key | Signature/Ciphertext | Speed |
|-----------|-----------|---------------------|-------|
| ECDSA P-256 | 64 B | 64 B | Fast |
| RSA-2048 | 256 B | 256 B | Moderate |
| **ML-KEM-768** | 1,184 B | 1,088 B | Fast |
| **ML-DSA-65** | 1,952 B | 3,293 B | Moderate |
| **SLH-DSA-128s** | 32 B | 7,856 B | Slow |

### Performance Impact by Use Case

| Use Case | Impact | Mitigation |
|----------|--------|------------|
| TLS handshakes | Moderate (larger keys) | Hardware acceleration |
| JWT tokens | Minimal | Use ML-DSA |
| Blockchain | High (larger signatures) | Batching, aggregation |
| IoT devices | Significant | Choose appropriate security level |

---

## Tools and Resources

### Testing Tools

| Tool | Purpose | Link |
|------|---------|------|
| **Open Quantum Safe** | PQC library collection | github.com/open-quantum-safe |
| **Cloudflare circl** | Go crypto library | github.com/cloudflare/circl |
| **PQC TLS Testing** | Test PQC TLS support | pq.cloudflareresearch.com |

### Industry Resources

- **NIST PQC Project**: csrc.nist.gov/projects/post-quantum-cryptography
- **CISA PQC Guidance**: cisa.gov/quantum
- **Quantum-Safe Security Working Group**: quantum-safe.org

---

## Frequently Asked Questions

### When will quantum computers break current encryption?

Expert estimates range from 2030-2040 for a cryptographically relevant quantum computer. The exact timeline is uncertain, but "harvest now, decrypt later" attacks mean data encrypted today is already at risk.

### Can I just wait until quantum computers exist?

No. Migrating cryptographic infrastructure takes 5-15 years. Organizations need to start planning now to complete migration before quantum computers arrive.

### Are symmetric algorithms like AES safe?

Mostly yes. Grover's algorithm provides only a quadratic speedup against symmetric encryption. AES-256 effectively becomes AES-128 security against quantum attacks—still considered secure.

### Should I switch from RSA to ECC first?

If you haven't migrated to ECC, you might consider going directly to hybrid PQC. Both RSA and ECC are equally vulnerable to quantum attacks.

### Will TLS 1.3 automatically become quantum-safe?

No. TLS 1.3 will need to incorporate post-quantum key exchange algorithms. Hybrid approaches (X25519 + ML-KEM) are being standardized.

### What about Bitcoin and blockchain?

Bitcoin and most blockchains use ECDSA, which is quantum-vulnerable. These systems will need to migrate to post-quantum signatures—a significant challenge.

---

## Action Items for Developers

### This Week

- [ ] Learn the basics of post-quantum cryptography
- [ ] Review NIST's PQC standards documentation
- [ ] Inventory cryptographic usage in your projects

### This Month

- [ ] Experiment with liboqs or similar PQC libraries
- [ ] Test ML-KEM and ML-DSA in development
- [ ] Measure performance impact on your applications

### This Quarter

- [ ] Present PQC risks to your security team
- [ ] Identify highest-priority systems for migration
- [ ] Create a preliminary migration roadmap

---

## Conclusion

Post-quantum cryptography isn't a future problem—it's a present concern. The "harvest now, decrypt later" threat means that sensitive data encrypted today could be exposed when quantum computers mature.

NIST has given us the standards (ML-KEM, ML-DSA, SLH-DSA, FN-DSA). Libraries exist. The path forward is clear:

1. **Understand** what you're protecting and for how long
2. **Implement** hybrid cryptography combining classical and PQC
3. **Migrate** progressively, starting with highest-risk systems

The developers and organizations that start now will have a significant advantage. Don't wait for the quantum apocalypse—prepare for it.

---

**Last Updated:** January 2026

**Questions?** Connect on [LinkedIn](https://www.linkedin.com/in/agrawal-sumit/) or [GitHub](https://github.com/tech-sumit).
