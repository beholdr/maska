<script>
  import BindValue from './BindValue.svelte'
  import DataAttr from './DataAttr.svelte'
  import Event from './Event.svelte'
  import InitialValue from './InitialValue.svelte'
  import Number from './Number.svelte'
  import Options from './Options.svelte'
  import Simple from './Simple.svelte'

  let Component = $state(Simple)
</script>

<main>
  <select bind:value={Component}>
    <option value={BindValue}>BindValue</option>
    <option value={DataAttr}>DataAttr</option>
    <option value={Event}>Event</option>
    <option value={InitialValue}>InitialValue</option>
    <option value={Number}>Number</option>
    <option value={Options}>Options</option>
    <option value={Simple}>Simple</option>
  </select>

  <div class="comp">
    <Component />
  </div>
</main>

<style>
  .comp {
    margin-top: 1em;
    padding: 1em;
    border: 1px solid #ccc;
  }
</style>
