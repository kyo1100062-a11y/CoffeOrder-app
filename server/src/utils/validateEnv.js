import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 환경 변수 검증 함수
 */
export const validateEnv = () => {
  // .env 파일 로드
  const envPath = path.join(__dirname, '../../.env');
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error('❌ .env 파일을 읽을 수 없습니다:', result.error.message);
    console.error('   server/.env 파일이 존재하는지 확인하세요.');
    return false;
  }

  // 필수 환경 변수 목록
  const requiredVars = {
    PORT: {
      value: process.env.PORT,
      validator: (val) => {
        const port = parseInt(val, 10);
        return !isNaN(port) && port >= 1 && port <= 65535;
      },
      errorMsg: 'PORT는 1-65535 사이의 숫자여야 합니다.'
    },
    DB_HOST: {
      value: process.env.DB_HOST,
      validator: (val) => val && val.trim().length > 0,
      errorMsg: 'DB_HOST는 비어있을 수 없습니다.'
    },
    DB_PORT: {
      value: process.env.DB_PORT,
      validator: (val) => {
        const port = parseInt(val, 10);
        return !isNaN(port) && port >= 1 && port <= 65535;
      },
      errorMsg: 'DB_PORT는 1-65535 사이의 숫자여야 합니다.'
    },
    DB_NAME: {
      value: process.env.DB_NAME,
      validator: (val) => val && val.trim().length > 0,
      errorMsg: 'DB_NAME는 비어있을 수 없습니다.'
    },
    DB_USER: {
      value: process.env.DB_USER,
      validator: (val) => val && val.trim().length > 0,
      errorMsg: 'DB_USER는 비어있을 수 없습니다.'
    },
    DB_PASSWORD: {
      value: process.env.DB_PASSWORD,
      validator: (val) => {
        // 비밀번호는 반드시 문자열이어야 하고 비어있으면 안됨
        return val !== undefined && val !== null && String(val).trim().length > 0;
      },
      errorMsg: 'DB_PASSWORD는 반드시 설정되어야 합니다. (빈 값 불가)'
    }
  };

  const errors = [];
  const warnings = [];

  // 각 환경 변수 검증
  for (const [key, config] of Object.entries(requiredVars)) {
    if (!config.value) {
      errors.push(`❌ ${key}: 설정되지 않음`);
    } else if (!config.validator(config.value)) {
      errors.push(`❌ ${key}: ${config.errorMsg} (현재 값: ${config.value})`);
    } else {
      // 비밀번호는 마스킹하여 표시
      if (key === 'DB_PASSWORD') {
        console.log(`✅ ${key}: ***설정됨*** (길이: ${String(config.value).length})`);
      } else {
        console.log(`✅ ${key}: ${config.value}`);
      }
    }
  }

  // 템플릿 값 확인
  if (process.env.DB_PASSWORD === 'your_password' || 
      process.env.DB_PASSWORD === 'your_postgresql_password_here') {
    warnings.push('⚠️  DB_PASSWORD가 템플릿 값입니다. 실제 PostgreSQL 비밀번호로 변경하세요!');
  }

  // 결과 출력
  console.log('\n=== 환경 변수 검증 결과 ===');
  
  if (errors.length > 0) {
    console.error('\n❌ 오류:');
    errors.forEach(error => console.error(`   ${error}`));
    console.error('\n💡 해결 방법:');
    console.error('   1. server/.env 파일을 엽니다');
    console.error('   2. 위의 누락된 환경 변수를 설정합니다');
    console.error('   3. env.example 파일을 참고하세요');
    return false;
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  경고:');
    warnings.forEach(warning => console.warn(`   ${warning}`));
  }

  console.log('\n✅ 모든 환경 변수가 올바르게 설정되었습니다!');
  return true;
};

// 직접 실행 시
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const isValid = validateEnv();
  process.exit(isValid ? 0 : 1);
}

