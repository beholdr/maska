<script lang="ts">
  import BindValue from './BindValue.svelte'
  import Event from './Event.svelte'
  import InitialValue from './InitialValue.svelte'
  import Number from './Number.svelte'
  import Options from './Options.svelte'
  import Simple from './Simple.svelte'

  let component = Simple
</script>

<main>
  <select bind:value={component}>
    <option value={BindValue}>BindValue</option>
    <option value={Event}>Event</option>
    <option value={InitialValue}>InitialValue</option>
    <option value={Number}>Number</option>
    <option value={Options}>Options</option>
    <option value={Simple}>Simple</option>
  </select>

  <div class="comp">
    <svelte:component this={component} />
  </div>
</main>

<style>
  .comp {
    margin-top: 1em;
    padding: 1em;
    border: 1px solid #ccc;
  }
</style>
