import { proxy, useSnapshot } from 'valtio'
import { config } from './config'

const functionPlaceholder = () => void 0

type SetNumber = (n: number) => void

type GlobalState = {
  camera: {
    zoom: number
    setZoom: SetNumber
  }
}

export const globalState = proxy<GlobalState>({
  camera: {
    zoom: config.camera.zoomInterval[0],
    setZoom: functionPlaceholder,
  },
})

export const useGlobalState = () => useSnapshot(globalState)
