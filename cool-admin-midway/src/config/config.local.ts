import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import { TenantSubscriber } from '../modules/base/db/tenant';

/**
 * 鏈湴寮€鍙?npm run dev 璇诲彇鐨勯厤缃枃浠? */
export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'Lfb061026.',
        database: 'cool',
        // 鑷姩寤鸿〃 娉ㄦ剰锛氱嚎涓婇儴缃茬殑鏃跺€欎笉瑕佷娇鐢紝鏈夊彲鑳藉鑷存暟鎹涪澶?        synchronize: true,
        // 鎵撳嵃鏃ュ織
        logging: false,
        // 瀛楃闆?        charset: 'utf8mb4',
        // 鏄惁寮€鍚紦瀛?        cache: true,
        // 瀹炰綋璺緞
        entities: ['**/modules/*/entity'],
        // 璁㈤槄鑰?        subscribers: [TenantSubscriber],
      },
    },
  },
  cool: {
    // 瀹炰綋涓庤矾寰勶紝璺熺敓鎴愪唬鐮併€佸墠绔姹傘€乻wagger鏂囨。鐩稿叧 娉ㄦ剰锛氱嚎涓婁笉寤鸿寮€鍚紝浠ュ厤鏆撮湶鏁忔劅淇℃伅
    eps: true,
    // 鏄惁鑷姩瀵煎叆妯″潡鏁版嵁搴?    initDB: true,
    // 鍒ゆ柇鏄惁鍒濆鍖栫殑鏂瑰紡
    initJudge: 'db',
    // 鏄惁鑷姩瀵煎叆妯″潡鑿滃崟
    initMenu: true,
  } as CoolConfig,
} as MidwayConfig;
