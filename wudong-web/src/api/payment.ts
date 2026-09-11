import request from '@/utils/request'

// 模拟支付
export function mockPay(orderNo: string) {
  return request.post('/app/payment/mock', { orderNo })
}
