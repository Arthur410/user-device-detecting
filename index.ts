import { InteractionType } from "@/modules/appDeviceDetect/InteractionType";
import { OrientationType } from "@/modules/appDeviceDetect/OrientationType";
import { DeviceType } from "@/modules/appDeviceDetect/DeviceType";

export default class AppDeviceDetect {
    public interactionType: InteractionType.State;
    public orientationType: OrientationType.State;
    public deviceType: DeviceType.State;

    constructor () {
        this.interactionType = InteractionType.State.Unknown;
        this.orientationType = OrientationType.State.Unknown;
        this.deviceType = DeviceType.State.Unknown;

        window.addEventListener('touchstart', this.activeTouchState, { once: true });
        window.addEventListener('mousemove',  this.activeDeskState, { once: true });
    }

    public defineTouchscreen (): void {
        if (window.PointerEvent && ('maxTouchPoints' in navigator)) {
            // if Pointer Events are supported, just check maxTouchPoints
            if (navigator.maxTouchPoints > 0) {
                this.activeTouchState();
            }
        } else {
            // no Pointer Events...
            if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
                // check for any-pointer:coarse which mostly means touchscreen
                this.activeTouchState();
            } else if (window.TouchEvent || ('ontouchstart' in window)) {
                // last resort - check for exposed touch events API / event handler
                this.activeTouchState();
            }
        }
    }

    private activeTouchState (): void {
        if (this.interactionType === InteractionType.State.Mouse) {
            this.interactionType = InteractionType.State.Both;
        } else {
            this.interactionType = InteractionType.State.Touch;
        }
    }

    private activeDeskState (): void {
        if (this.interactionType === InteractionType.State.Touch) {
            this.interactionType = InteractionType.State.Both;
        } else {
            this.interactionType = InteractionType.State.Mouse;
        }
    }

    public defineDeviceType (): void {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            this.deviceType = DeviceType.State.Tab;
            return;
        }
        if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            this.deviceType = DeviceType.State.Phone;
            return;
        }
        this.deviceType = DeviceType.State.Desktop;
    };

    public defineOrientationType (): void {
        if (window.matchMedia("(orientation: portrait)").matches) {
            this.orientationType = OrientationType.State.Portrait;
        } else if (window.matchMedia("(orientation: landscape)").matches) {
            this.orientationType = OrientationType.State.Landscape;
        }
    }
}