<template>
  <div class="home">

    <h1>
      Hi, {{ userName }}, you are about to experience Future meeting scheduler
      engine
    </h1>
    <div>
      <span> Here are your settings </span>
      <a-spin class="loading" v-if="listLoading" />
      <div class="calendar-list">
        <a-radio-group v-model="shared" @change="dirty = true">
          <a-radio
            class="calendar-list-item"
            v-for="calendar in calendars"
            :key="calendar.id"
            :value="calendar.id"
          >
            {{ calendar.summary }}
          </a-radio>
        </a-radio-group>
        <a-button
          :loading="loading"
          style="width: 80px; margin-top: 10px; display: block"
          :disabled="shareDisabled"
          type="primary"
          @click="shareCalendar"
        >
          Share
        </a-button>
      </div>
    </div>
    
    <a-spin class="loading" v-if="preLoading" />
    <div v-else class="preference">
      <a-form-model
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :label="index === 0 ? 'Preference' : ''"
          :prop="'domains.' + index + '.time'"
          ref="time"
          class="preference-container"
        >
          <a-time-picker
            v-model="domain.time.start"
            format="HH:mm"
            placeholder="upper bound"
            style="width: 47%"
          />
          ~
          <a-time-picker
            v-model="domain.time.end"
            format="HH:mm"
            placeholder="lower bound"
            style="width: 47%"
          />
          <div>weight:</div>
          <a-slider
            :dots="true"
            :default-value="1"
            v-model="domain.weight"
            :max="5"
            :min="1"
            style="width: 80%; margin-left: 10px; display: inline-block"
          />
          <a-icon
            class="dynamic-delete-button"
            type="minus-circle-o"
            @click="removeDomain(domain)"
          />
        </a-form-model-item>
        <a-button type="dashed" style="display: block" @click="addDomain">
          <a-icon type="plus" /> More Customized Preference
        </a-button>
        <a-form-model-item label="Max Meetings per Day">
          <a-input-number
            :min="0"
            :max="100000"
            v-model="dynamicValidateForm.maxMeeting"
          />
          <span v-if="dynamicValidateForm.maxMeeting === 0"> No Limit </span>
        </a-form-model-item>
        <a-form-model-item label="Break Time">
          <a-input-number
            :min="0"
            :max="100000"
            :default-value="10"
            :step="5"
            :formatter="(value) => `${value} (minutes)`"
            :parser="(value) => value.replace('(minutes)', '')"
            v-model="dynamicValidateForm.breakTime"
            style="width: 50%"
          />
        </a-form-model-item>
        <a-form-model-item label="Day Off">
          <a-checkbox-group
            :options="dayOptions"
            :value="dynamicValidateForm.dayOff"
            @change="onDayOffChange"
          />
        </a-form-model-item>

        <a-form-model-item>
          <a-button
            :loading="preLoading"
            type="primary"
            style="display: block"
            @click="savePreference"
          >
            Save Preference
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div>
      <a-button
        type="primary"
        @click="toMeeting"
        :loading="savingPre"
        :disabled="
          !this.calendars.map((el) => el.id).includes(this.shared) &&
          !this.dirty
        "
      >
        Schedule a new Meeting!
      </a-button>
    </div>
  </div>
</template>

<script>
import apis from "@/utils/apis";
export default {
  name: "Home",
  components: {},
  created() {},
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      calendars: [],
      shared: null,
      dirty: false,
      loading: false,
      listLoading: true,
      preLoading: true,
      savingPre: false,
      fetchedPreference: {},
      dayOptions: [
        { label: "Mon", value: 1 },
        { label: "Tue", value: 2 },
        { label: "Wed", value: 3 },
        { label: "Thur", value: 4 },
        { label: "Fri", value: 5 },
        { label: "Sat", value: 6 },
        { label: "Sun", value: 0 },
      ],
      dynamicValidateForm: {
        domains: [
          {
            time: {
              start: "",
              end: "",
            },
            weight: 1,
            key: 0,
          },
        ],
        maxMeeting: 0,
        breakTime: 0,
        dayOff: [],
      },
    };
  },
  computed: {
    code() {
      return this.$route.query.code;
    },
    user() {
      return window.auth2.currentUser.get();
    },
    userName() {
      return this.user.getBasicProfile().getName();
    },
    shareDisabled() {
      return (
        !this.calendars.map((el) => el.id).includes(this.shared) || !this.dirty
      );
    },
  },
  async mounted() {
    const { user } = this;
    const userLoginToken = user.getAuthResponse().id_token;
    try {
      this.listLoading = true;
      const res = await apis.listCalendars({
        userLoginToken,
        code: this.code || null,
      });
      if (res.data.type === "authUrl") {
        window.location.replace(res.data.authUrl);
      } else {
        this.calendars = res.data.data.list;
        this.shared = res.data.data.shared;
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.listLoading = false;
    }

    try {
      this.preLoading = true;
      const res = await apis.getPreference({
        user_id: user.getBasicProfile().getEmail(),
      });
      if (res.data.length === 1) {
        const data = res.data[0];
        this.dynamicValidateForm = {
          domains: data.preferences.map((el) => ({
            time: { start: el.start, end: el.end },
            weight: el.counter,
          })),
          maxMeeting: data.max_meeting,
          dayOff: data.day_off,
          breakTime: data.break_time,
        };
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.preLoading = false;
    }
  },
  methods: {
    onDayOffChange(val) {
      console.error(val);
      this.dynamicValidateForm.dayOff = val;
    },

    async savePreference() {
      try {
        this.savingPre = true;
        const res = await apis.savePreference({
          preferences: this.dynamicValidateForm.domains.map((domain) => ({
            start: domain.time.start,
            end: domain.time.end,
            counter: domain.weight,
          })),
          max_meeting: this.dynamicValidateForm.maxMeeting || 0,
          break_time: this.dynamicValidateForm.breakTime || 0,
          day_off: this.dynamicValidateForm.dayOff || [],
          user_id: this.user.getBasicProfile().getEmail(),
        });
        console.error(res);
      } catch (e) {
        console.error(e);
      } finally {
        this.savingPre = false;
      }
    },
    removeDomain(item) {
      let index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },

    addDomain() {
      this.dynamicValidateForm.domains.push({
        time: {
          start: "",
          end: "",
        },
        weight: 1,
        key: Date.now(),
      });
    },
    async shareCalendar() {
      this.loading = true;
      const userLoginToken = this.user.getAuthResponse().id_token;
      try {
        await apis.shareCalendar({
          userLoginToken,
          calendarId: this.shared,
          userID: this.user.getBasicProfile().getEmail(),
        });
        this.dirty = false;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    toMeeting() {
      this.$router.push({ name: "NewMeeting" });
    },
  },
};
</script>


<style scoped >
.calendar-list-item {
  width: 100%;
}
.loading {
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
  display: block;
}
.nextButton {
  position: absolute;
  bottom: 0px;
  right: 0px;
}
.preference-container {
  margin-top: 5px;
  color: #999;
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
  float: right;
}
</style>