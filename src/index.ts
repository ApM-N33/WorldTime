import "./assets/styles/index.scss"
import { BaseController } from "./controllers/BaseController"
import { setupSwiper } from "./libs/swiper"
import type { IBaseController } from "./types/baseController/BaseController.types"
import { useVisualViewport as useModalsViewport } from "./utils/domUtils/useVisualViewport"

useModalsViewport().updateNewModalPositions()
const baseController: IBaseController = new BaseController()
baseController.transferOfDependencies()
baseController.setup()
setupSwiper()
