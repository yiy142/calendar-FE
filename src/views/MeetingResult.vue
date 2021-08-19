<template>
  <div>
    <div class="result" v-if="result">
      <span> We suggest to schedule your meeting on </span>
      <div class="result-date">
        {{ goodDate }}
      </div>
      <div class="result-time">{{ goodTime }}</div>
      <div v-if="result.ids.length">
        People who have conflicts with this meeting:
        <div class="result-conflict" v-for="name in conflictNames" :key="name">
          {{ name }}
        </div>
        <div class="resut-counter">{{ result.counter }}</div>
      </div>
      <div v-else>Nobody has conflicts with this time slot</div>
      <a-button :loading="loading" @click="scheduleMeeting"> Confirm </a-button>
    </div>
    <div v-else>No result is found!</div>
  </div>
</template>

<script>
import apis from "@/utils/apis";
import moment from "moment";

export default {
  props: {
    resultInput: Object,
    eventMeta: Object,
  },
  mounted: () => {

  },
  data: () => ({
    loading: false,
  }),
  methods: {
    moment(val) {
      return moment(val);
    },

    async scheduleMeeting() {
      try {
        this.loading = true;
        const res = await apis.pushCalendar({
          ...this.eventMeta,
          uuid: this.resultInput.uuid,
          dateTime: {
            start: this.startDate.toISOString(),
            end: moment(this.startDate)
              .add(parseInt(this.eventMeta.duration), "m")
              .toDate()
              .toISOString(),
          },
        });
        console.error(res);
        this.loading = false;
      } catch (e) {
        console.error(e);
      }
    },
  },
  computed: {
    result() {
      return this.resultInput?.slot[0];
    },
    conflictNames() {
      const res = [];
      for (let id of this.result.ids) {
        res.push(this.eventMeta.fullAttendees.find((el) => el.id === id));
      }
      return res;
    },
    startDate() {
      return new Date(this.result.left);
    },
    endDate() {
      return new Date(this.result.right);
    },
    goodDate() {
      return this.startDate.toLocaleDateString("en-US");
    },
    goodTime() {
      const endDate = moment(this.startDate)
              .add(parseInt(this.eventMeta.duration), "m")
              .toDate();

      return `From ${this.startDate.toLocaleTimeString(
        "en-US"
      )} to ${endDate.toLocaleTimeString("en-US")}`;
    },
  },
};
</script>

<style>
</style>