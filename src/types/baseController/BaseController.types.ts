import type { Tcontrollers } from "./controllers.types"

interface IBaseControllerProperties {
  controllers: Tcontrollers
}

interface IBaseControllerMethods {
  setup(): Promise<void>
  transferOfDependencies(): void
}

export interface IBaseController
  extends IBaseControllerProperties,
    IBaseControllerMethods {}
