import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CERT_DIR = resolve(__dirname, '..', '.certs')
const DOMAIN = 'local.nolmoa.com'

const check = spawnSync('mkcert', ['-version'], { stdio: 'ignore' })
if (check.status !== 0) {
  console.error('mkcert가 설치되어 있지 않습니다.')
  console.error('  macOS:  brew install mkcert nss')
  console.error('  Linux:  https://github.com/FiloSottile/mkcert#installation')
  process.exit(1)
}

if (!existsSync(CERT_DIR)) mkdirSync(CERT_DIR, { recursive: true })

const install = spawnSync('mkcert', ['-install'], { stdio: 'inherit' })
if (install.status !== 0) {
  console.warn('\n⚠ mkcert -install 실패 (sudo 권한 필요). 다음을 직접 실행하세요:')
  console.warn('   sudo mkcert -install')
  console.warn('   (이미 설치된 경우 인증서 생성은 계속됩니다)\n')
}

const gen = spawnSync(
  'mkcert',
  [
    '-key-file',
    resolve(CERT_DIR, `${DOMAIN}-key.pem`),
    '-cert-file',
    resolve(CERT_DIR, `${DOMAIN}.pem`),
    DOMAIN,
    'localhost',
    '127.0.0.1',
    '::1',
  ],
  { stdio: 'inherit' },
)

if (gen.status !== 0) {
  console.error('인증서 생성 실패')
  process.exit(1)
}

console.log(`\n✓ 인증서가 .certs/ 에 생성되었습니다.`)
console.log(`  /etc/hosts에 다음 줄이 있는지 확인하세요:`)
console.log(`    127.0.0.1 ${DOMAIN}`)
console.log(`  이후 npm run dev 로 https://${DOMAIN}:5173 에 접속하세요.`)
