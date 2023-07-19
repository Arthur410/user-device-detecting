import { injectable } from "mcdis-app";
import { DeviceType } from "../enums/DeviceType";
import { InteractionType } from "../enums/InteractionType";
import { OrientationType } from "../enums/OrientationType";
import { Ref, ref } from "vue";

// @injectable("device-detect") - this is my option, but it might be not yours)
export class AppDeviceDetect {
  private p_interactionType: Ref<InteractionType.State>;
  private p_orientationType: Ref<OrientationType.State>;
  private p_deviceType: Ref<DeviceType.State>;

  constructor() {
    this.p_interactionType = ref(InteractionType.State.Unknown);
    this.p_orientationType = ref(OrientationType.State.Unknown);
    this.p_deviceType = ref(DeviceType.State.Unknown);

    window.addEventListener("touchstart", () => this.activeTouchState(), { once: true });
    window.addEventListener("mousemove", () => this.activeDeskState(), { once: true });
  }

  public get InteractionType() {
    return this.p_interactionType.value;
  }

  public get OrientationType() {
    return this.p_orientationType.value;
  }

  public get DeviceType() {
    return this.p_deviceType.value;
  }


  public defineTouchscreen(): void {
    if (window.PointerEvent && "maxTouchPoints" in navigator) {
      // if Pointer Events are supported, just check maxTouchPoints
      if (navigator.maxTouchPoints > 0) {
        this.activeTouchState();
      }
    } else {
      // no Pointer Events...
      if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
        // check for any-pointer:coarse which mostly means touchscreen
        this.activeTouchState();
      } else if (window.TouchEvent || "ontouchstart" in window) {
        // last resort - check for exposed touch events API / event handler
        this.activeTouchState();
      }
    }
  }

  private activeTouchState(): void {
    if (this.p_interactionType.value === InteractionType.State.Mouse) {
      this.p_interactionType.value = InteractionType.State.Both;
    } else {
      this.p_interactionType.value = InteractionType.State.Touch;
    }
  }

  private activeDeskState(): void {
    if (this.p_interactionType.value === InteractionType.State.Touch) {
      this.p_interactionType.value = InteractionType.State.Both;
    } else {
      this.p_interactionType.value = InteractionType.State.Mouse;
    }
  }

  private defineDeviceType(): void {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      this.p_deviceType.value = DeviceType.State.Tab;
      return;
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      this.p_deviceType.value = DeviceType.State.Phone;
      return;
    }
    this.p_deviceType.value = DeviceType.State.Desktop;
  }

  private defineOrientationType(): void {
    if (window.matchMedia("(orientation: portrait)").matches) {
      this.p_orientationType.value = OrientationType.State.Portrait;
    } else if (window.matchMedia("(orientation: landscape)").matches) {
      this.p_orientationType.value = OrientationType.State.Landscape;
    }
  }
}
