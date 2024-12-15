저는 6개월전쯤 yarn에서 pnpm으로 마이그레이션을 결정했습니다.

yarn의 PnP는 Git에 지속적으로 부하를 주었고 PnP 시스템은 호환되지 않는 생태계가 많아 결국에는 사용하기 힘든 경우가 많습니다.

또 한편으로 React Native는 프론트엔드 생태계의 도구들을 따라가지 못하는 대표적인 도구중 하나입니다.

## React Native는 왜 모노레포에서 쓰기 힘든가?

[Expo Work With Monorepos](https://docs.expo.dev/guides/monorepos/)

문서를 보면 Yarn 1 Workspace 에 대한 지원을 First Class로 한다는 것을 확인할 수 있습니다.

## 심볼릭 링크란?

Symbolic Link는 파일 시스템에서 다른 파일이나 디렉토리를 가리키는 가상의 파일입니다.

원본 파일의 위치를 가리키는 지름길 같은 느낌인데요

그럼 실제 원본은 어디에 저장되는 걸까요? node_modules/.pnpm에 답이 있습니다.

이 .pnpm은 모노레포의 루트에 존재하게됩니다. 여기에는 모노레포 전체에서 같은 의존성을 공유하고 관리할 수 있게해줍니다.

이렇게 하면 중복 설치를 방지할 수 있고 디스크 공간도 절약할 수 있겠죠

```
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       ├── bar -> <store>/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo -> <store>/foo
    │       ├── bar -> ../../bar@1.0.0/node_modules/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    └── qar@2.0.0
        └── node_modules
            └── qar -> <store>/qar
```

foo는 심볼릭 링크의 foo@1.0.0을 가리킵니다. foo는 안에서 bar, qar에 의존합니다. 같은 심링크내에서 돌면되니까 ../../을 통해 .pnpm안에 있는 bar 1.0.0 패키지에 방문합니다.

bar는 또 qar@2.0.0에 의존합니다. 다시 ../../을 통해 .pnpm안에 있는 qar@2.0.0을 찾아갑니다.

이렇게하면 모든 패키지가 잘 찾아갈 수 있겠네요

## 순환 심볼릭 링크를 피하세요

순환 참조하지말라는 뜻인 것 같아요 A가 B를 참조하면서 B가 A를 다시 참조하는 상황을 피하라는거죠

## 패키지는 스스로 임포트할 수 있게 허용한다

자신의 버전 정보를 읽어오기위해 참조하려는 의도입니다.

## node-linker = hoisted의 의미

가장 혼란스러웠던건 심링크의 개념과 호이스팅의 개념이었습니다.

기본적으로 pnpm은 의존성을 각 패키지마다 격리하여 직접 명시한 패키지만 접근 가능하도록 관리합니다.

하지만 hoisted 되면 모든 패키지가 공통 의존성 위치를 통해 다른 의존성에 접근 가능합니다.

[pnpm](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm)
