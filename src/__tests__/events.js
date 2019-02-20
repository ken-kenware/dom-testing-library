import {fireEvent} from '..'
import document from './helpers/document'
import window from './helpers/window'

const eventTypes = [
  {
    type: 'Clipboard',
    events: ['copy', 'paste'],
    elementType: 'input',
  },
  {
    type: 'Composition',
    events: ['compositionEnd', 'compositionStart', 'compositionUpdate'],
    elementType: 'input',
  },
  {
    type: 'Keyboard',
    events: ['keyDown', 'keyPress', 'keyUp'],
    elementType: 'input',
  },
  {
    type: 'Focus',
    events: ['focus', 'blur', 'focusIn', 'focusOut'],
    elementType: 'input',
  },
  {
    type: 'Form',
    events: ['focus', 'blur'],
    elementType: 'input',
  },
  {
    type: 'Focus',
    events: ['change', 'input', 'invalid'],
    elementType: 'input',
  },
  {
    type: 'Focus',
    events: ['submit'],
    elementType: 'form',
  },
  {
    type: 'Mouse',
    events: [
      'click',
      'contextMenu',
      'dblClick',
      'drag',
      'dragEnd',
      'dragEnter',
      'dragExit',
      'dragLeave',
      'dragOver',
      'dragStart',
      'drop',
      'mouseDown',
      'mouseEnter',
      'mouseLeave',
      'mouseMove',
      'mouseOut',
      'mouseOver',
      'mouseUp',
    ],
    elementType: 'button',
  },
  {
    type: 'Selection',
    events: ['select'],
    elementType: 'input',
  },
  {
    type: 'Touch',
    events: ['touchCancel', 'touchEnd', 'touchMove', 'touchStart'],
    elementType: 'button',
  },
  {
    type: 'UI',
    events: ['scroll'],
    elementType: 'div',
  },
  {
    type: 'Wheel',
    events: ['wheel'],
    elementType: 'div',
  },
  {
    type: 'Media',
    events: [
      'abort',
      'canPlay',
      'canPlayThrough',
      'durationChange',
      'emptied',
      'encrypted',
      'ended',
      'error',
      'loadedData',
      'loadedMetadata',
      'loadStart',
      'pause',
      'play',
      'playing',
      'progress',
      'rateChange',
      'seeked',
      'seeking',
      'stalled',
      'suspend',
      'timeUpdate',
      'volumeChange',
      'waiting',
    ],
    elementType: 'video',
  },
  {
    type: 'Image',
    events: ['load', 'error'],
    elementType: 'img',
  },
  {
    type: 'Animation',
    events: ['animationStart', 'animationEnd', 'animationIteration'],
    elementType: 'div',
  },
  {
    type: 'Transition',
    events: ['transitionEnd'],
    elementType: 'div',
  },
]

eventTypes.forEach(({type, events, elementType}) => {
  describe(`${type} Events`, () => {
    events.forEach(eventName => {
      it(`fires ${eventName}`, () => {
        const node = document.createElement(elementType)
        const spy = jest.fn()
        node.addEventListener(eventName.toLowerCase(), spy)
        fireEvent[eventName](node)
        expect(spy).toHaveBeenCalledTimes(1)
      })
    })
  })
})

describe(`Aliased Events`, () => {
  it(`fires doubleClick`, () => {
    const node = document.createElement('div')
    const spy = jest.fn()
    node.addEventListener('dblclick', spy)
    fireEvent.doubleClick(node)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

test('assigns target properties', () => {
  const node = document.createElement('input')
  const spy = jest.fn()
  const value = 'a'
  node.addEventListener('change', spy)
  fireEvent.change(node, {target: {value}})
  expect(spy).toHaveBeenCalledTimes(1)
  expect(node.value).toBe(value)
})

test('assigning a value to a target that cannot have a value throws an error', () => {
  const node = document.createElement('div')
  expect(() =>
    fireEvent.change(node, {target: {value: 'a'}}),
  ).toThrowErrorMatchingInlineSnapshot(
    `"The given element does not have a value setter"`,
  )
})

test('assigning the files property on an input', () => {
  const node = document.createElement('input')
  const file = new document.defaultView.File(['(⌐□_□)'], 'chucknorris.png', {
    type: 'image/png',
  })
  fireEvent.change(node, {target: {files: [file]}})
  expect(node.files).toEqual([file])
})

test('fires events on Window', () => {
  const messageSpy = jest.fn()
  window.addEventListener('message', messageSpy)
  fireEvent(window, new window.MessageEvent('message', {data: 'hello'}))
  expect(messageSpy).toHaveBeenCalledTimes(1)
  window.removeEventListener('message', messageSpy)
})

test('does not fire click event on disabled elements', () => {
  const clickSpy = jest.fn()
  const changeSpy = jest.fn()
  const inputSpy = jest.fn()

  const node = document.createElement('input')
  node.setAttribute('type', 'checkbox')
  node.disabled = true

  node.addEventListener('click', clickSpy)
  node.addEventListener('change', changeSpy)
  node.addEventListener('change', inputSpy)

  fireEvent.click(node)

  expect(clickSpy).not.toHaveBeenCalled()
  expect(changeSpy).not.toHaveBeenCalled()
  expect(inputSpy).not.toHaveBeenCalled()
})

test('does not fire click event if is contained by a parent', () => {
  const clickSpy = jest.fn()
  const changeSpy = jest.fn()
  const inputSpy = jest.fn()

  const parentNode = document.createElement('fieldset')
  parentNode.disabled = true

  const node = document.createElement('input')
  node.setAttribute('type', 'checkbox')
  node.addEventListener('click', clickSpy)
  node.addEventListener('change', changeSpy)
  node.addEventListener('change', inputSpy)
  parentNode.appendChild(node)

  fireEvent.click(node)

  expect(clickSpy).not.toHaveBeenCalled()
  expect(changeSpy).not.toHaveBeenCalled()
  expect(inputSpy).not.toHaveBeenCalled()
})

test('does fires the click event if is contained by a parent that can not be disabled', () => {
  const clickSpy = jest.fn()
  const changeSpy = jest.fn()
  const inputSpy = jest.fn()

  const parentNode = document.createElement('div')
  parentNode.disabled = true

  const node = document.createElement('input')
  node.setAttribute('type', 'checkbox')
  node.addEventListener('click', clickSpy)
  node.addEventListener('change', changeSpy)
  node.addEventListener('change', inputSpy)
  parentNode.appendChild(node)

  fireEvent.click(node)

  expect(clickSpy).toHaveBeenCalled()
  expect(changeSpy).toHaveBeenCalled()
  expect(inputSpy).toHaveBeenCalled()
})
