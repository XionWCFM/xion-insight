모듈 페더레이션 설정이 알음알음 익혀야하는것들이 많아서 시간을 좀 들였습니다.

## remote app (호스트에 의해 띄워질 작은 서비스)

```
  "scripts": {
    "dev": "vite --port 5001 --strictPort",
    "build": "vite build",
    "preview": "vite preview --port 5001 --strictPort",
    "serve": "vite preview --port 5001 --strictPort"
  },

```

포트 번호는 자유롭게 지정합니다. 그냥 dev 서버 켜면 안되니까 serve를 통해서 포트를 열어줘야합니다.

이유는 잘 모르겠음..

vite preview는 빌드 결과물을 보여주는 것이기 때문에 HMR이 동작하지 않습니다.

이부분은 향후 개선하겠습니다.

```
pnpm i -D @originjs/vite-plugin-federation
```

페더레이션 플러그인 설치합니다.

```tsx
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "@mf-xion-bn",
      filename: "remoteEntry.js",
      exposes: {
        "./bottom-navigation": "./src/bottom-navigation.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

- name : 별 의미없습니다. 이름 짓는거에요

- filename : 가상으로 있다고 상상하는 파일의 이름이라고 합니다. remoteEntry.js라고 짓는게 국룰인듯합니다. 그냥 따릅니다.

- expos: 객체로 작성합니다. package.json의 exports 필드랑 완전히 동일하게 생각하면 될듯합니다.

- shared : 공유 의존성 계층을 정의합니다.

- build : 그냥 남들 설정 고대로 따왔습니다.

## host App (다른 리모트들을 모아서 만들 하나의 쉘 역할 수행)

```
  "scripts": {
    "dev": "vite --port 5000 --strictPort",
    "build": "vite build",
    "preview": "vite preview --port 5000 --strictPort",
    "serve": "vite preview --port 5000 --strictPort"
  },
```

마찬 가지로 포트번호는 자유입니다.

잘 안쓰는 포트 쓰는게 편하니까 적당히 고르는게 좋은듯 합니다.

```
pnpm i -D @originjs/vite-plugin-federation
```

```tsx
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app",
      remotes: {
        "@mf-xion-bn": "http://localhost:5001/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

여기서 주목할 점은 remotes들을 가져오는 부분입니다.

expose가 내보내는 측의 입장이었다면 remotes는 가져오는 측의 입장이 됩니다.

여기서 작성한게 곧 실질적으로 사용할 import 경로가 됩니다.

```tsx
import Hi from "http://localhost:5001/assets/remoteEntry.js";
```

이건 좀.. 그렇다 그죠 적당히 패키지 이름 짓는것처럼 지어주면 될듯 합니다.

```tsx
import BottomNavigation from "@mf-xion-bn/bottom-navigation";

function App() {
  return (
    <div>
      <div>hdasedsadsaddsallo</div>
      <BottomNavigation />
    </div>
  );
}

export default App;
```

이렇게 import 경로를 expose한 필드에 맞게 따줍니다.

여기서 중요한점은 타입스크립트 지원이 제대로 안된다는 부분입니다.

이부분은 따로 d.ts를 정의하는것을 통해 해결할 수 있습니다.

```tsx
declare module "@mf-xion-bn/bottom-navigation" {
  import { FC } from "react";

  const BottomNavigation: FC;
  export default BottomNavigation;
}
```

이렇게 수동으로 하는게 맞나 싶긴합니다만 머 어쩌겠습니까

ㅎㅎ;ㅋ;;

## HMR 대책

모노레포의 루트에서 작업해주도록 하겠습니다. 터보레포 기준이지만 큰 틀 자체는 다른 모노레포에서도 쓸 수 있습니다.

```
pnpm i -w -D concurrently kill-port browser-sync
```

```
    "dev:mf": "concurrently \"pnpm watch\" \"pnpm watch:browser\" \"pnpm serve\"",
    "watch:browser": "node bs-config.js",
    "watch": "turbo run build -- --watch",
    "serve": "pnpm --parallel --filter \"./**\" preview",
    "stop": "kill-port --port 5000,5001",
```

- concurrently : 한터미널에서 여러개의 명령을 동시에 실행할 수 있게 해줍니다.

- brwoser-sync : preview로 띄우면 브라우저도 일일이 새로고침해줘야합니다. 와칭하고있는 파일이 변경되면 브라우저도 새로고침해주는 녀석입니다.

- kill-port 말그대로 포트 죽여주는 라이브러리입니다.

루트에 browsersync용 코드를 작성합시다.

bs-config.js

```js
const browserSync = require("browser-sync");

browserSync.init({
  proxy: "http://localhost:5000", // 호스트 앱이 실행되는 포트
  files: [
    "**/remoteEntry.js", // 리모트 빌드 파일 경로
  ],
  port: 4999,
  reloadDelay: 10, // 새로고침 딜레이
});
```

파일이름은 마음대로 지으셔도 무방합니다.

proxy 부분엔 호스트앱의 포트를 넣어주고 files에는 와칭할 파일들을 적습니다. glob 패턴 사용 가능합니다.

port는 browserSync가 실행될 포트입니다. 다른 포트에서 실제 포트를 미러링하면서 새로고침 로직을 추가하는게 핵심로직인듯합니다.

당연하게도 HMR을 누리려면 browserSync가 실행된 포트에서 작업해야합니다.

reloadDelay는 말그대로 새로고침하는 데 드는 딜레이입니다.

## 완성

이제 다 했으니

```
pnpm run dev:mf
```

를 통해 서버를 켜고 4999 포트로 들어가서 작업하면 됩니다.

해피엔딩 해피엔딩
