---
outline: deep
---

# 主题

在本项目中，主题系统基于[ant-design-vue](https://antdv.com/docs/vue/customize-theme-cn#api)
的主题配置，通过将常用的主题配置（主题色、字体色、背景色...）生成`CSS变量`,然后[unocss](https://unocss.dev/config/theme)
引用生成好的`CSS变量`，确保组件库Ui与自定义Ui的`统一性`。

## 配置明亮&暗黑主题

[Theme](#自定义主题配置)类型在`types/theme.d.ts`中查看

```ts
export default class AppConstant {
    // 明亮主题
    static LIGHT_THEME: Theme = {
        // 一级文本色设置为红色
        colorText: 'red'
    }

    // 暗黑主题
    static DARK_THEME: Theme = {
        // 一级文本色设置为蓝色
        colorText: 'blue'
    }

    // 中性主题（不区分明亮和暗黑）
    static NEUTER_THEME: NeuterTheme = {
        textLight: 'rgba(255, 255, 255, 0.85)',
        bgDark: '#0a121e',
        fillDark: 'rgba(255, 255, 255, .1)',
        borderDark: '#2b2f34'
    }
}
```

> 代码位置：`src/constant/app.ts`

## 配置中性主题

中性主题无论是明亮模式还是暗黑模式都会生效

```ts
declare interface NeuterTheme {
    // 明亮字体
    textLight?: string

    // 暗色背景
    bgDark?: string

    // 填充暗色
    fillDark?: string

    // 边框暗色
    borderDark?: string
}
```

> 代码位置：`types/theme.d.ts`

```ts
export default class AppConstant {
    static NEUTER_THEME: NeuterTheme = {
        textLight: 'rgba(255, 255, 255, 0.85)',
        bgDark: '#0a121e',
        fillDark: 'rgba(255, 255, 255, .1)',
        borderDark: '#2b2f34'
    }
}
```

> 代码位置：`src/constant/app.ts`

## 自定义主题配置

```ts
interface Theme extends Partial<GlobalToken> {
    // 在这里自定义主题配置
}

```

> [GlobalToken文档说明](https://antdv.com/docs/vue/customize-theme-cn#api)

> 代码位置：`types/theme.d.ts`

## 主题变量映射到`unocss`

```ts
// uno.config.ts
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
    extendTheme(theme) {
        return {
            ...theme,
            colors: {
                ...theme.colors,
                // 主色
                'primary': 'var(--colorPrimary)',
                // 浅主色
                'primary-shallow': 'var(--colorPrimaryBg)',
                // 填充色
                'fill': {
                    // 一级填充色
                    'main': 'var(--colorFill)',
                    // 二级填充色
                    'secondary': 'var(--colorFillSecondary)',
                    // 三级填充色
                    'tertiary': 'var(--colorFillTertiary)',
                    // 四级填充色
                    'quaternary': 'var(--colorFillQuaternary)',
                    // 填充暗黑色
                    'dark': 'var(--fillDark)'
                },
            },
            textColor: {
                ...theme.textColor,
                // 一级文本色
                'main': 'var(--colorText)',
                // 二级级文本色
                'secondary': 'var(--colorTextSecondary)',
                // 三级文本色
                'tertiary': 'var(--colorTextTertiary)',
                // 四级文本色
                'quaternary': 'var(--colorTextQuaternary)',
                // 亮色
                'light': 'var(--textLight)'
            },
            backgroundColor: {
                ...theme.backgroundColor,
                // 组件容器背景色
                'container': 'var(--colorBgContainer)',
                // 浮层容器背景色
                'container-elevated': 'var(--colorBgElevated)',
                // 布局背景色
                'layout': 'var(--colorBgLayout)',
                // 引起注意的背景色
                'spotlight': 'var(--colorBgSpotlight)',
                // 浮层的背景蒙层颜色
                'mask': 'var(--colorBgMask)',
                // 背景暗黑色
                'dark': 'var(--bgDark)'
            },
            borderColor: {
                ...theme.borderColor,
                // 一级边框色
                'main': 'var(--colorBorder)',
                // 二级边框色
                'secondary': 'var(--colorBorderSecondary)',
                'dark': 'var(--borderDark)'
            },
            boxShadow: {
                ...theme.boxShadow,
                'main': 'var(--boxShadow)',
                'secondary': 'var(--boxShadowSecondary)'
            }
        }
    },
})
```

### 在`HTML`中使用

```vue
<template>
  <h1 class="text-primary">主题色的标题</h1>
  <div class="bg-primary">主题色的背景</div>
  <p class="text-main">一级文本色</p>
</template>
```

### 在`CSS`中使用

```css
div{
    /* 一级文本色 */
    color: theme('colors.main');
    /* 一级文本色 */
    background: theme('backgroundColor.container');
}
```