"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultComponentService = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const view_model_registration_1 = require("../../core/view-model-registration");
const n_exception_1 = require("@nivinjoseph/n-exception");
const utilities_1 = require("../../core/utilities");
class DefaultComponentService {
    compile(componentViewModelClass, cache) {
        n_defensive_1.given(componentViewModelClass, "componentViewModelClass").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(cache, "cache").ensureIsBoolean();
        const registration = new view_model_registration_1.ViewModelRegistration(componentViewModelClass);
        return this.create(registration, !!cache);
    }
    create(registration, cache) {
        n_defensive_1.given(registration, "registration").ensureHasValue().ensureIsType(view_model_registration_1.ViewModelRegistration);
        n_defensive_1.given(cache, "cache").ensureHasValue().ensureIsBoolean();
        const component = {};
        component._cache = cache;
        // component.template = registration.template;
        if (typeof registration.template === "string") {
            component.template = registration.template;
        }
        else {
            component.render = registration.template.render;
            component.staticRenderFns = registration.template.staticRenderFns;
        }
        component.inject = ["pageScopeContainer", "rootScopeContainer"];
        component.data = function () {
            let vueVm = this;
            const container = vueVm.pageScopeContainer || vueVm.rootScopeContainer;
            if (!container)
                throw new n_exception_1.ApplicationException("Could not get pageScopeContainer or rootScopeContainer.");
            if (component.___reload) {
                const c = container;
                const cReg = c.componentRegistry.find(registration.name);
                cReg._component = component.___viewModel;
                cReg._dependencies = cReg.getDependencies();
                component._cachedVm = null;
                // registration.reload(component.___viewModel);
                component.___reload = false;
            }
            let vm = null;
            if (component._cache) {
                if (component._cachedVm)
                    vm = component._cachedVm;
                else
                    vm = component._cachedVm = container.resolve(registration.name);
            }
            else {
                vm = container.resolve(registration.name);
            }
            let data = { vm: vm };
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
            vm._bindings = [];
            return data;
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
        return component;
    }
}
exports.DefaultComponentService = DefaultComponentService;
//# sourceMappingURL=default-component-service.js.map