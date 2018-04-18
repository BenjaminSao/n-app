"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_args_1 = require("./route-args");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const utilities_1 = require("./utilities");
const n_exception_1 = require("@nivinjoseph/n-exception");
class PageComponentFactory {
    create(registration) {
        n_defensive_1.given(registration, "registration").ensureHasValue();
        const component = {};
        component.template = registration.template;
        component.inject = ["rootScopeContainer"];
        component.data = function () {
            let vueVm = this;
            let container = vueVm.rootScopeContainer;
            if (!container)
                throw new n_exception_1.ApplicationException("Could not get rootScopeContainer.");
            container = container.createScope(); // page scope
            let vm = container.resolve(registration.name);
            let data = {
                vm: vm,
                pageScopeContainer: container
            };
            let methods = {};
            let computed = {};
            let propertyInfos = utilities_1.Utilities.getPropertyInfos(vm);
            for (let info of propertyInfos) {
                if (typeof (info.descriptor.value) === "function")
                    methods[info.name] = info.descriptor.value.bind(vm);
                else if (info.descriptor.get || info.descriptor.set) {
                    computed[info.name] = {
                        get: info.descriptor.get ? info.descriptor.get.bind(vm) : undefined,
                        set: info.descriptor.set ? info.descriptor.set.bind(vm) : undefined
                    };
                }
            }
            vueVm.$options.methods = methods;
            vueVm.$options.computed = computed;
            vm._ctx = vueVm;
            return data;
        };
        component.provide = function () {
            return {
                pageScopeContainer: this.pageScopeContainer
            };
        };
        component.beforeCreate = function () {
            // console.log("executing beforeCreate");
            // console.log(this.vm);
        };
        component.created = function () {
            // console.log("executing created");
            // console.log(this.vm);
            if (this.vm.onCreate)
                this.vm.onCreate();
        };
        component.beforeMount = function () {
            // console.log("executing beforeMount");
            // console.log(this.vm);
        };
        component.mounted = function () {
            // console.log("executing mounted");
            // console.log(this.vm);
            if (this.vm.onMount)
                this.vm.onMount(this.$el);
        };
        component.beforeUpdate = function () {
            // console.log("executing beforeUpdate");
            // console.log(this.vm);
        };
        component.updated = function () {
            // console.log("executing updated");
            // console.log(this.vm);
        };
        component.beforeDestroy = function () {
            // console.log("executing beforeDestroy");
            // console.log(this.vm);
        };
        component.destroyed = function () {
            // console.log("executing destroyed");
            // console.log(this.vm);
            if (this.vm.onDestroy)
                this.vm.onDestroy();
        };
        /* The Full Navigation Resolution Flow
                Navigation triggered
                Call leave guards in deactivated components
                Call global beforeEach guards
                Call beforeRouteUpdate guards in reused components (2.2+)
                Call beforeEnter in route configs
                Resolve async route components
                Call beforeRouteEnter in activated components
                Call global beforeResolve guards (2.5+)
                Navigation confirmed.
                Call global afterEach hooks.
                DOM updates triggered.
                Call callbacks passed to next in beforeRouteEnter guards with instantiated instances.
         */
        component.beforeRouteEnter = function (to, from, next) {
            // called before the route that renders this component is confirmed.
            // does NOT have access to `this` component instance,
            // because it has not been created yet when this guard is called!
            let routeArgs = null;
            try {
                routeArgs = route_args_1.RouteArgs.create(registration.route, to);
            }
            catch (error) {
                console.log(error);
                next(false);
                return;
            }
            if (registration.title)
                window.document.title = registration.title;
            next((vueModel) => {
                if (registration.title)
                    window.document.title = registration.title;
                let vm = vueModel.vm;
                vm.__routeArgs = routeArgs;
                if (vm.onEnter)
                    routeArgs.routeArgs.length > 0 ? vm.onEnter(...routeArgs.routeArgs) : vm.onEnter();
            });
        };
        component.beforeRouteUpdate = function (to, from, next) {
            // called when the route that renders this component has changed,
            // but this component is reused in the new route.
            // For example, for a route with dynamic params /foo/:id, when we
            // navigate between /foo/1 and /foo/2, the same Foo component instance
            // will be reused, and this hook will be called when that happens.
            // has access to `this` component instance.
            let routeArgs = null;
            try {
                routeArgs = route_args_1.RouteArgs.create(registration.route, to);
            }
            catch (error) {
                console.log(error);
                next(false);
                return;
            }
            let fromRouteArgs = null;
            try {
                fromRouteArgs = route_args_1.RouteArgs.create(registration.route, from);
            }
            catch (error) {
                console.log(error);
                fromRouteArgs = new route_args_1.RouteArgs({}, {}, []);
            }
            if (routeArgs.equals(fromRouteArgs)) {
                if (registration.title)
                    window.document.title = registration.title;
                next();
                return;
            }
            let vm = this.vm;
            if (vm.onLeave)
                vm.onLeave();
            vm.__routeArgs = routeArgs;
            if (vm.onEnter)
                routeArgs.routeArgs.length > 0 ? vm.onEnter(...routeArgs.routeArgs) : vm.onEnter();
            if (registration.title)
                window.document.title = registration.title;
            next();
        };
        component.beforeRouteLeave = function (to, from, next) {
            // called when the route that renders this component is about to
            // be navigated away from.
            // has access to `this` component instance.
            let vm = this.vm;
            if (vm.onLeave)
                vm.onLeave();
            next();
        };
        return component;
    }
}
exports.PageComponentFactory = PageComponentFactory;
//# sourceMappingURL=page-component-factory.js.map