<template>
  <div class="meeting-input">
    <a-spin :tip="loadingTip" :spinning="calculating">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="Meeting title" ref="title" prop="title">
          <a-input v-model="form.title" placeholder="Meeting Summary" />
        </a-form-model-item>
        <a-form-model-item
          label="Meeting duration (in minutes)"
          ref="duration"
          prop="duration"
        >
          <a-input
            v-model="form.duration"
            placeholder="Meeting Duration (in minutes)"
          />
        </a-form-model-item>
        <a-form-model-item
          label="Meeting description"
          ref="description"
          prop="description"
        >
          <a-input
            ref="descriptionInput"
            v-model="form.description"
            placeholder="Meeting Description"
          />
        </a-form-model-item>
        <div v-if="!!purpose" class="description-msg">
          Your Meeting purpose would be:
          <a-tag color="blue">
            {{ purpose }}
          </a-tag>
        </div>
        <div v-else class="description-msg">
          Please include one of
          <a @click="descriptionTemplate('social')"> social </a>,
          <a @click="descriptionTemplate('chat')"> chat </a>,
          <a @click="descriptionTemplate('work')"> work </a>
          in your description.
        </div>
        <a-form-model-item
          label="Participants"
          ref="participants"
          prop="participants"
        >
          <a-select
            mode="multiple"
            :default-value="[]"
            placeholder="Select attendees"
            @change="handleParticipantChange"
          >
            <a-select-option
              v-for="user in allUsers"
              :key="user.id"
              :value="JSON.stringify(user)"
            >
              {{ user.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Meeting date" ref="date" prop="date">
          <a-range-picker
            :ranges="{
              Today: [moment(), moment()],
              'This Week': [moment(), moment().endOf('week')],
              'Next Week': [
                moment().add(1, 'weeks').startOf('week'),
                moment().add(1, 'weeks').endOf('week'),
              ],
            }"
            @change="dateChange"
            style="width: 100%"
          />
        </a-form-model-item>
        <a-form-model-item
          ref="time"
          prop="time"
          label="Upper and Lower Time Bound For Meeting"
        >
          <a-time-picker
            v-model="form.time.start"
            format="HH:mm"
            placeholder="upper bound"
            style="width: 47%"
          />
          ~
          <a-time-picker
            v-model="form.time.end"
            format="HH:mm"
            placeholder="lower bound"
            style="width: 47%"
            @change="
              () => {
                $refs.time.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="Preference Setting">
          <a-radio-group v-model="toggle">
            <a-radio :value="0"> No User Preference </a-radio>
            <a-radio :value="1"> Only My Preference </a-radio>
            <a-radio :value="2"> All Participants' Preferences </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="getNorm" :loading="calculating">
            Find Norm!
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </div>
</template>

<script>
import moment from "moment";
import apis from "@/utils/apis";

const rules = {
  title: {
    required: true,
    message: "Please input Meeting Title",
    trigger: "blur",
  },
  duration: {
    required: true,
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input a duration"));
      }
      if (value < 0) {
        callback(new Error("Please input a valid duration"));
      }
      callback();
    },
    trigger: "blur",
  },
  description: {
    required: true,
    message: "Please input a meeting description",
    trigger: "blur",
  },
  participants: {
    type: "array",
    required: true,
    validator: (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error("Please select at least one participants"));
      }
      callback();
    },
    trigger: "change",
  },
  date: { type: "array", required: true, message: "Please input date" },
  time: {
    required: true,
    validator: (rule, value, callback) => {
      if (!value.start || !value.end) {
        callback("Please input time range");
        return;
      }
      if (value.start > value.end) {
        callback("Please input valid time range");
        return;
      } else callback();
    },
    trigger: "blur",
  },
};
export default {
  name: "MeetingInput",
  async mounted() {
    try {
      const res = await apis.getUsers();
      this.allUsers = res.data.filter(
        (el) => el.id !== this.user.getBasicProfile().getEmail()
      );
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    user() {
      return window.auth2.currentUser.get();
    },
    purpose() {
      const splitted = this.form.description.split(" ");
      for (let type of this.purposeTypes) {
        if (splitted.indexOf(type) !== -1) {
          return type;
        }
      }
      return null;
    },
  },
  data() {
    return {
      toggle: 0,
      loadingTip: "",
      purposeTypes: ["social", "chat", "work"],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      allUsers: [],
      calculating: false,
      form: {
        title: "",
        duration: 60,
        participants: [],
        date: [],
        description: "chat with xxx",
        time: {
          start: moment("08:00", "HH:mm"),
          end: moment("20:00", "HH:mm"),
        },
      },
      rules,
    };
  },
  methods: {
    descriptionTemplate(type) {
      switch (type) {
        case "chat":
          this.form.description = `chat with ${
            this.allUsers[0].name || "someone"
          }`;
          break;
        case "work":
          this.form.description = `work meeting with ${
            this.allUsers[0].name || "someone"
          }`;
          break;
        case "social":
          this.form.description = `social with ${
            this.allUsers[0].name || "someone"
          }`;
          break;
      }
      this.$refs.descriptionInput.focus();
      this.$refs.descriptionInput.blur();
    },
    dateChange(value) {
      this.form.date = [value[0].toISOString(), value[1].toISOString()];
    },
    moment() {
      return moment();
    },
    async getNorm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        } else {
          this.calculating = true;
          this.loadingTip = "Analyzing history data...";
          let candidateDays = [];
          let start = new Date(this.form.date[0]);
          const end = new Date(this.form.date[1]);
          const candidateDates = [];
          while (start <= end) {
            candidateDates.push(start.toISOString());
            candidateDays.push(start.getDay());
            start.setDate(start.getDate() + 1);
          }
          candidateDays = Array.from(new Set(candidateDays)).map(
            (el) => "" + el
          );
          const normRes = await apis.findNorm({
            participants: this.form.participants.map((el) => el.id),
            organizer: {
              email: this.user.getBasicProfile().getEmail(),
              name: this.user.getBasicProfile().getName(),
            },
            candidateDays,
            candidateDates,
            trainingBound: "2021-06-20T10:05:01.284Z",
            description: this.form.description,
            preferenceToggle: this.toggle,
          });
          this.loadingTip = "Calculating the best time for your meeting...";
          let minCount = Math.min(...Object.values(normRes.data.res.day));

          const normDays = Object.entries(normRes.data.res.day)
            .filter((kv) => {
              return kv[1] === minCount;
            })
            .map((el) => el[0]);
          start = new Date(this.form.date[0]);
          const normDates = [];
          while (start <= end) {
            if (normDays.includes("" + start.getDay())) {
              normDates.push(start.toISOString());
            }
            start.setDate(start.getDate() + 1);
          }
          const normTimes = Object.entries(normRes.data.res.time)
            .filter((kv) => {
              return (
                kv[1] === Math.min(...Object.values(normRes.data.res.time))
              );
            })
            .map((el) => el[0]);
          console.error(normTimes);
          const slotRes = await apis.findSlot({
            payload: {
              dates: normDates,
              idealTimes: normTimes,
              duration: this.form.duration,
              user_ids: [
                ...this.form.participants.map((el) => el.id),
                this.user.getBasicProfile().getEmail(),
              ],
              time: {
                meeting_start_time: this.form.time.start.toDate().toISOString(),
                meeting_end_time: this.form.time.end.toDate().toISOString(),
              },
            },
          });
          const userSharedCalendar = await apis.getUserEmail({
            email: this.user.getBasicProfile().getEmail(),
          });
          console.error(slotRes);

          this.calculating = false;
          this.$router.push({
            name: "Result",
            params: {
              resultInput: slotRes.data,
              eventMeta: {
                calendarId: userSharedCalendar.data[0].id,
                attendees: this.form.participants.map((el) => el.id),
                fullAttendees: this.form.participants,
                description: this.form.description,
                summary: this.form.title,
                duration: this.form.duration,
              },
            },
          });
        }
      });
    },
    handleParticipantChange(value) {
      if (value.length) {
        this.form.participants = value.map((el) => JSON.parse(el));
      } else {
        this.form.participants = [];
      }
    },
    onSubmit() {
      console.log("submit!", this.form);
    },
  },
};
</script>

<style scoped>
.ant-form-item /deep/ {
  margin-bottom: 10px;
}
.description-msg {
  margin-bottom: 10px;
}
</style>