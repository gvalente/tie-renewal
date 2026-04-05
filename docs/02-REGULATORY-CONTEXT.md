# Regulatory Context & Renewal Process — HQP/PAC Permits in Spain

> This document has been validated against a real renewal application submitted March 2, 2026 through the Law 14/2013 portal. All document requirements, form fields, fee amounts, and portal URLs are verified firsthand.

## Legal Framework

The HQP permit — **Profesional Altamente Cualificado (PAC)** — is regulated under **Law 14/2013** (Ley de apoyo a emprendedores y su internacionalización). Processed by the **UGE-CE** (Unidad de Grandes Empresas y Colectivos Estratégicos), a national unit under the Ministry of Inclusion, Social Security and Migration. All renewals go through UGE-CE in Madrid — this is national, not regional.

### HQP/PAC vs Regular Work Permits

| Aspect | HQP/PAC (Law 14/2013) | Regular Work Permit |
|--------|----------------------|---------------------|
| Portal | expinterweb.inclusion.gob.es/iley11/ | Mercurio / local Oficina de Extranjería |
| Processing deadline | 20 business days | 3 months |
| Administrative silence | **Positive** (auto-approved) | Negative (auto-denied) |
| Initial application | Employer files | Employer files |
| **Renewal** | **Candidate files (TITULAR)** | Varies |
| Renewal duration | 2 years | 2 years |

**This distinction is the #1 source of confusion.** Users go to the wrong office or use the wrong portal.

## The Government Portal

### Base URL
`https://expinterweb.inclusion.gob.es/iley11/inicio/showTramites.action?procedimientoSel=200&proc=1`

Full title: "Presentación de solicitudes de autorización de residencia de movilidad internacional (Autorizaciones reguladas por la Ley 14/2013, de apoyo a los emprendedores y su internacionalización)"

### Portal Sections

| Section | URL Path | Function | Auth |
|---------|----------|----------|------|
| Info | `elegirTramite.action?tramiteSel=0&procedimientoSel=200&proc=1` | Procedure info, doc links | No |
| Submit (Alta Solicitud) | `elegirTramite.action?tramiteSel=1&procedimientoSel=200&proc=1` | File new/renewal application | Certificate |
| Check Status | `consultaSolicitud/verExptesPresentador.action` | View submitted applications & status | Certificate |
| Notifications | `elegirTramite.action?tramiteSel=3&procedimientoSel=200&proc=1` | Official communications | Certificate |

### Fee Payment
- **Portal:** `https://expinterweb.inclusion.gob.es/Tasa038/presentarFormulario038.action`
- **Fee model:** Tasa modelo 790
- **Amount:** €78.67 (as of February 2026)
- **Payment method:** Card via TPV Virtual (online)
- **Output:** Payment generates an NRC (Número de Referencia Completo, e.g., `7900381129304DZS28LMK8`) which must be entered during application submission

### Status Page — What the User Sees
The status check page (`consultaSolicitud/verExptesPresentador.action`) shows a search form and results table:

**Search fields:** Número registro, Fecha alta inicio, Fecha alta fin → "Buscar"

**Results table columns:**
| Fecha alta | Número registro | Estado expediente | Acuse de Recibo |
|------------|----------------|-------------------|-----------------|
| 02/03/2026 | REGAGE26e00022070621 | En trámite | [PDF download] |

**Status values:**
- **En trámite** — Being processed (normal for first 20 business days)
- **En trámite - Requerido** — Additional documents needed (ACTION REQUIRED — clock pauses)
- **Resuelto favorable** — Approved
- **Resuelto no favorable** — Denied

### Alternative Status Checking
1. **infoext2:** `https://sede.administracionespublicas.gob.es/infoext2/` (Cl@ve or form-based, no certificate needed)
2. **SMS:** Send `NIE [number]` or `EXPE [registro]` to **651 714 610** (free)
3. **Phone:** **902 02 22 22** (24h) or **060**

### Contact
- **Email:** movilidad.internacional@inclusion.gob.es
- **Address:** Calle de José Abascal, 39 - 28003 Madrid

## The Renewal Process — Step by Step (Verified)

### Who Files the Renewal?
The **permit holder (TITULAR)** files the renewal themselves. Unlike the initial application (which the employer handles), the renewal is the candidate's responsibility. This catches people off guard — it was completely new to the founder despite having been through the initial process with his employer.

### Phase 1: Preparation (Start 60+ days before TIE expiry)

**Renewal window:** Can file starting 60 calendar days before TIE expiry. Can file up to 90 calendar days after expiry (but risks a fine).

**Prerequisites:**
- Still employed by the same company (employer change = new application, not renewal)
- Still meeting salary thresholds (~€54K executives, ~€40K technical/scientific)
- Have a valid FNMT digital certificate installed
- Have AutoFirma installed

**Documents to prepare (VERIFIED — only 4 mandatory uploads):**

| # | Document | Description |
|---|----------|-------------|
| 1 | **Full passport copy** | All pages, PDF format |
| 2 | **Tasa 790 payment receipt** | Pay online first, download receipt PDF |
| 3 | **Employment contract** | Signed by both worker and company, all pages, PDF |
| 4 | **Formulario MIT (MOV-INT)** | Application form, signed by applicant, PDF |

**Not required (despite what many guides say):** TIE card copy, company qualification proof, payslips, Vida Laboral, criminal record certificate (unless absent from Spain >6 months).

### Phase 2: Pay the Fee

1. Go to: `https://expinterweb.inclusion.gob.es/Tasa038/presentarFormulario038.action`
2. Fill in personal details (NIE, name)
3. Pay €78.67 via card
4. Save the receipt PDF — you'll upload it during submission
5. Note the NRC (Número de Referencia Completo) — you'll enter it in the application form

### Phase 3: Submit the Application

**Portal:** Alta Solicitud → authenticate with digital certificate

**Form fields (verified from real application):**

**Type of Application:**
- Applicant: HOLDER (Titular)
- Guy [Type]: RENEWAL (Renovación)
- Subtype: HOLDER OF INTERNATIONAL MOBILITY RESIDENCE PERMIT

**Application for residence permit:**
- Authorization type: HIGHLY QUALIFIED NATIONAL PROFESSIONAL
- Authorization subtype: GRADUATES/POSTGRADUATES/SPECIALISTS

**Foreigner's information:** Name, passport, NIE, DOB, nationality, address in Spain, contact info, parents' names

**Reference number:** Enter the NRC from fee payment

**Company/entity details in Spain:** Company name (Razón Social), NIF/CIF, contract end date

**Electronic notifications:** Option to receive notifications electronically (recommended — select "I agree")

**Documentation attached:** Upload the 4 mandatory PDFs (max 24MB total)

**Other Documentation:** Optional field for "Qualification" and additional files (max 8MB)

**Submit and sign** → AutoFirma signs the application

**Output:** You receive two documents:
1. **Acuse de Recibo** (receipt) — contains the **Número de registro** (e.g., REGAGE26e00022070621)
2. **Application details PDF** — full record of everything submitted

**CRITICAL: Save both PDFs immediately.** The Número de registro is your tracking ID.

**Legal effect:** Filing before expiry automatically extends your current authorization until resolution.

### Phase 4: Waiting Period (20 Business Days)

Per Article 76.1 of Law 14/2013, UGE-CE has **20 business days** to respond. Business days = weekdays excluding Spanish national holidays (UGE-CE is national, so only national holidays count).

**If requerimiento received:** Clock PAUSES. You have 10 business days to respond. Check notifications section of the portal.

**If no response after 20 business days and no requerimiento:** **Silencio administrativo positivo** — your renewal is legally approved.

### Phase 5: Status Checking

Check at: `https://expinterweb.inclusion.gob.es/iley11/consultaSolicitud/verExptesPresentador.action`

Log in with digital certificate → your submitted applications appear with current status.

Also check via SMS (send `NIE [number]` to 651 714 610) or infoext2 portal.

**What to look for:**
- "En trámite" = normal, keep waiting
- "Requerido" = they need documents, ACT NOW
- "Resuelto favorable" = approved, proceed to TIE card appointment
- "Resuelto no favorable" = denied, consider appeal

### Phase 6: Silencio Administrativo Positivo (If Past 20 Days)

If 20+ business days have passed with no resolution AND no requerimiento:
1. Confirm no requerimiento was issued (check notifications: tramiteSel=3)
2. Request UGE-CE issue a certificate of positive silence (certificado acreditativo)
3. Methods: Sede Electrónica, any Registro Público, email to movilidad.internacional@inclusion.gob.es, or in person at UGE-CE in Madrid
4. In practice, UGE-CE often issues the formal favorable resolution shortly after the deadline, citing administrative silence
5. With the certificate/resolution → book TIE card appointment at local police station

### Phase 7: Post-Approval — Getting the New TIE Card

1. Book cita previa at local Comisaría de Policía Nacional
2. Bring: favorable resolution, current TIE, passport, passport-size photo, empadronamiento, Tasa 790-012 receipt
3. Fingerprints/biometrics taken
4. TIE card ready in 30-45 days
5. Receive temporary document (resguardo) as proof of legal status while waiting

## Authentication: FNMT Digital Certificate

The Law 14/2013 portal requires a **certificado electrónico** (FNMT digital certificate). This is the primary authentication method.

**How to obtain (free):**
1. Install FNMT Configurator from sede.fnmt.gob.es
2. Request certificate online (enter NIE, surname, email) → receive request code
3. Verify identity within 15 days:
   - In person at a registration office (free), OR
   - Via video call (€2.99+IVA, 24/7)
4. Download and install certificate (~1 hour after verification)

**Critical:** Same computer + browser for request and download. Don't update browser between steps.

**AutoFirma:** Required software for electronic signing. Download from firmaelectronica.gob.es.

## Key URLs — Complete Reference

| Resource | URL |
|----------|-----|
| **Law 14/2013 Portal** | `https://expinterweb.inclusion.gob.es/iley11/inicio/showTramites.action?procedimientoSel=200&proc=1` |
| Submit Application | `...elegirTramite.action?tramiteSel=1&procedimientoSel=200&proc=1` |
| **Check Status** | `...consultaSolicitud/verExptesPresentador.action` |
| Notifications | `...elegirTramite.action?tramiteSel=3&procedimientoSel=200&proc=1` |
| **Fee Payment (Tasa 790)** | `https://expinterweb.inclusion.gob.es/Tasa038/presentarFormulario038.action` |
| infoext2 Status | `https://sede.administracionespublicas.gob.es/infoext2/` |
| FNMT Certificate | `https://www.sede.fnmt.gob.es` |
| Cl@ve | `https://clave.gob.es` |
| AutoFirma | `https://firmaelectronica.gob.es/Home/Descargas.html` |
| Official Info | `https://sede.inclusion.gob.es/-/presentacion-solicitudes-autorizacion-residencia` |
| Form Templates | `http://extranjeros.inclusion.gob.es/es/ModelosSolicitudes/ley_14_2013/index.html` |
| Renewal Docs Guide (PDF) | `https://www.inclusion.gob.es/documents/1823432/1826095/renovaciones_ingles_feb_2018.pdf` |

## Common Pitfalls (Verified)

1. **Wrong portal.** Using Mercurio or going to local Oficina de Extranjería instead of the Law 14/2013 Sede Electrónica
2. **Not knowing the renewal is YOUR responsibility.** Employers handle initial applications; renewals are on the candidate
3. **Over-preparing documents.** Only 4 are required — don't waste time gathering unnecessary paperwork
4. **Missing the NRC.** Pay the fee FIRST, note the reference number, then start the application
5. **Browser/AutoFirma issues.** Chrome and Firefox work best. Mac users may need workarounds for AutoFirma
6. **Not counting business days correctly.** Weekends and national holidays don't count toward the 20 days
7. **Not checking for requerimientos.** A request for additional docs pauses the clock — check notifications regularly
8. **Panicking after day 20.** If still "En trámite" with no requerimiento past day 20, silencio positivo should apply — this is actually good
9. **Name mismatches.** NIE, passport, and certificate names must match exactly
10. **Filing after expiry without knowing about fine risk.** Filing within 90 days post-expiry is legal but may incur a sanción
