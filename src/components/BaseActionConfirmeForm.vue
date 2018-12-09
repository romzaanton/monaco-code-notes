<template>
  <v-card dark>
    <v-card-title>{{message}}</v-card-title>
    <v-card-actions>
      <v-btn block color="error" @click="$emit('on-confirme', true)">Delete</v-btn>
      <v-btn block color="warn" @click="$emit('on-confirme', false)">Cancle</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component({
  name: 'app-action-confirme-form',
})
export default class ActionConfirmeForm extends Vue {
  @Prop({ default: '' })
  private message!: string;
}

</script>
