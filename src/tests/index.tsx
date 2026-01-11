import {
  renderHook as _renderHook,
  render,
  type RenderHookOptions,
  type RenderResult,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import type { JSXElementConstructor, PropsWithChildren, ReactNode } from 'react';
import TestAppProviders, { type TestAppProvidersProps } from './TestAppProviders';

type _RouteParams = string | { [key: string]: number | string };

export function renderComponent(component: ReactNode): RenderResult {
  return render(<TestAppProviders>{component}</TestAppProviders>);
}

export function renderHook<Props extends PropsWithChildren, Result>(
  callback: () => Result,
  wrapper = true
) {
  const options: RenderHookOptions<Props> = {};
  if (wrapper) {
    options.wrapper = TestAppProviders as JSXElementConstructor<TestAppProvidersProps>;
  }
  return _renderHook(callback, options);
}
