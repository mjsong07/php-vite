import { mount } from '@vue/test-utils'
import HelloWorld from './HelloWorld.vue'
import { assert, describe, expect, it } from 'vitest'

describe('HelloWorld', () => {
  it('renders properly', () => { 
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
    expect(wrapper.html()).toContain('Hello Vitest')
    console.log('html', wrapper.html())
  })
})
