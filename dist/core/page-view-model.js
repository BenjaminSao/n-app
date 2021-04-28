"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageViewModel = void 0;
const base_view_model_1 = require("./base-view-model");
require("@nivinjoseph/n-ext");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const page_registration_1 = require("./page-registration");
const page_component_factory_1 = require("./page-component-factory");
// public
class PageViewModel extends base_view_model_1.BaseViewModel {
    get currentRoute() {
        let route = this.ctx.$route ? this.ctx.$route.fullPath : null;
        route = route ? route.trim() : null;
        if (route) {
            while (route.endsWith("/") || route.endsWith("?"))
                route = route.substr(0, route.length - 1).trimRight();
        }
        return route;
    }
    get pathArgs() {
        let routeArgs = this.__routeArgs;
        return routeArgs ? routeArgs.pathArgs : null;
    }
    get queryArgs() {
        let routeArgs = this.__routeArgs;
        return routeArgs ? routeArgs.queryArgs : null;
    }
    // override
    onEnter(...params) {
        n_defensive_1.given(params, "params").ensureHasValue().ensureIsArray();
    }
    // override
    onLeave() { }
    static createComponentOptions(component, defaultPageTitle, defaultPageMetadata) {
        n_defensive_1.given(component, "component").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(defaultPageTitle, "defaultPageTitle").ensureIsString();
        n_defensive_1.given(defaultPageMetadata, "defaultPageMetadata").ensureIsArray();
        const registration = new page_registration_1.PageRegistration(component, defaultPageTitle, defaultPageMetadata);
        const factory = new page_component_factory_1.PageComponentFactory();
        return factory.create(registration);
    }
}
exports.PageViewModel = PageViewModel;
//# sourceMappingURL=page-view-model.js.map