# caching

next.js에서는 데이터를 가져오는 방법이 여러가지 있습니다.

총 네개정도로 소개를 하고 있는데요

1. server에서 fetch

2. server에서 라이브러리 사용

3. 클라이언트에서 router handler를 통해

4. 클라이언트에서 라이브러리 사용

이번에는 가장 이해하기 어려운 1번만 중점적으로 살펴보겠습니다.

# server 에서 fetch

next.js는 자동으로 fetch의 반환값을 서버의 data cache에 캐싱합니다.

즉 이것을 통하여 빌드 시간 , 요청 시간에 데이터를 가져오고 캐시한 후 재사용할 수 있는 것입니다.

그러나 캐시는 최신 데이터를 보아야할 상황에도 그렇지 않을 수 있다는 문제가 있죠

그래서 revalidating을 하는 것이 중요합니다.

## revalidating

재검증 전략에는 크게 두가지를 생각할 수 있습니다.

1. Time-based revalidation

말그대로 시간을 기반으로 재검증하는 것입니다. 일정 시간이 지난 경우 자동으로 데이터의 유효성을 검증하는 것이죠

이런 경우에는 최신성이 그다지 안중요할 때 유용합니다.

2. On-Demand revalidation

이벤트를 기반으로 데이터를 재검증합니다. 온디맨드 재검증은 태그 기반, 경로 기반 접근 방식을 이용하여 데이터 그룹을 한번에 재검증합니다.


# vercel data cache

버셀의 데이터 캐시는 fetch 요청에 대한 "응답값"을 저장하는 특수한 캐시입니다.

이것을 통하여 fetch를 경로 단위가 아니라 각 fetch 단위로 캐시할 수 있어지는데요

동일한 경로에 정적, 동적, 재검증된 데이터를 함께 저장할 수 있습니다.

이것을 이용하면 모든 지역에 독립적으로 캐시가 존재하기 때문에 모든 데이터는 함수가 실행되는 곳과 가까운 곳에 캐시될 수 있어집니다. 그만큼 응답은 빨라지겠죠?




# 레퍼런스

https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching

https://nextjs.org/docs/app/building-your-application/caching#data-cache

https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching

https://vercel.com/docs/infrastructure/data-cache#
