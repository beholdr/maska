<script setup>
import { shallowRef } from 'vue'

import Sink from './Sink.vue'
import BindCompleted from './BindCompleted.vue'
import BindMasked from './BindMasked.vue'
import BindModel from './BindModel.vue'
import BindUnmasked from './BindUnmasked.vue'
import Callbacks from './Callbacks.vue'
import ChangeValue from './ChangeValue.vue'
import Config from './Config.vue'
import Custom from './Custom.vue'
import DataAttr from './DataAttr.vue'
import Dynamic from './Dynamic.vue'
import Events from './Events.vue'
import Hooks from './Hooks.vue'
import Initial from './Initial.vue'
import Model from './Model.vue'
import Multiple from './Multiple.vue'
import Options from './Options.vue'
import Parent from './Parent.vue'
import Simple from './Simple.vue'

const component = shallowRef(Sink)
</script>

<template>
  <select v-model="component">
    <option :value="Sink">Kitchen sink</option>
    <option :value="BindCompleted">BindCompleted</option>
    <option :value="BindMasked">BindMasked</option>
    <option :value="BindModel">BindModel</option>
    <option :value="BindUnmasked">BindUnmasked</option>
    <option :value="Callbacks">Callbacks</option>
    <option :value="ChangeValue">ChangeValue</option>
    <option :value="Config">Config</option>
    <option :value="Custom">Custom</option>
    <option :value="DataAttr">DataAttr</option>
    <option :value="Dynamic">Dynamic</option>
    <option :value="Events">Events</option>
    <option :value="Hooks">Hooks</option>
    <option :value="Initial">Initial</option>
    <option :value="Model">Model</option>
    <option :value="Multiple">Multiple</option>
    <option :value="Options">Options</option>
    <option :value="Parent">Parent</option>
    <option :value="Simple">Simple</option>
  </select>

  <div class="comp">
    <component :is="component"></component>
  </div>
</template>

<style scoped>
.comp {
  margin-top: 1em;
  padding: 1em;
  border: 1px solid #ccc;
}
</style>
