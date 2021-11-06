<template>
  <v-main>
    <v-container fill-height fluid>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md10>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Torrent Submit</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-stepper v-model="e1">
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1">
                    Upload Torrent File
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step :complete="e1 > 2" step="2">
                    Torrent Detail
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="3"> Result </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <ValidationObserver ref="obs1">
                    <v-stepper-content
                      step="1"
                      slot-scope="{ invalid, validated }"
                    >
                      <v-form>
                        <ValidationProvider
                          rules="required|mimes:application/x-bittorrent"
                        >
                          <v-file-input
                            :disabled="uploaded"
                            slot-scope="{ errors, valid }"
                            v-model="torrentfile"
                            :error-messages="errors"
                            :success="valid"
                            accept="application/x-bittorrent"
                            label="Please upload your torrent file"
                            truncate-length="60"
                          ></v-file-input>
                        </ValidationProvider>
                      </v-form>

                      <!-- <v-card-actions>
                      <v-btn color="primary" @click="login">Login</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn @click="clear">Clear</v-btn>
                      <v-btn
                        color="primary"
                        @click="submit"
                        :disabled="invalid || !validated"
                        >Register</v-btn
                      >
                    </v-card-actions> -->
                      <template v-if="!uploaded">
                        <v-btn
                          color="primary"
                          class="mx-4 my-1"
                          v-if="!uploaded"
                          @click="submitFile()"
                          :loading="uploading"
                          :disabled="invalid || !validated || uploading"
                        >
                          Upload
                        </v-btn>
                      </template>
                      <template v-if="uploaded">
                        <v-btn
                          color="primary"
                          class="mx-4 my-1"
                          v-if="uploaded"
                          @click="e1 = 2"
                          :disabled="invalid || !validated"
                        >
                          Next
                        </v-btn>
                        <!-- TODO: Notify server delete file id and cache -->
                        <v-btn
                          color="error"
                          class="mx-4 my-1"
                          v-if="uploaded"
                          @click="clearFile()"
                        >
                          Clear
                        </v-btn>
                      </template>
                    </v-stepper-content>
                  </ValidationObserver>

                  <v-stepper-content step="2">
                    <ValidationObserver ref="obs2">
                      <v-form>
                        <v-row align="center">
                          <v-col class="d-flex">
                            <v-select
                              prepend-icon="mdi-shape-outline"
                              :items="categories"
                              v-model="cid"
                              label="Category"
                              @change="fillSubCategories()"
                            ></v-select>
                          </v-col>
                          <v-col class="d-flex">
                            <v-select
                              :items="sub_categories"
                              v-model="scid"
                              label="Sub-Category"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <ValidationProvider name="Title" rules="required">
                          <v-text-field
                            slot-scope="{ errors, valid }"
                            prepend-icon="mdi-email"
                            v-model="torrent.name"
                            :error-messages="errors"
                            :success="valid"
                            label="Title"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider name="Sub-Title" rules="required">
                          <v-text-field
                            slot-scope="{ errors, valid }"
                            prepend-icon="mdi-account"
                            v-model="torrent.subname"
                            :counter="20"
                            :error-messages="errors"
                            :success="valid"
                            label="Sub-Title"
                            required
                          ></v-text-field>
                        </ValidationProvider>
                        <!-- TODO: Regex for IMDB link match -->
                        <ValidationProvider
                          name="IMDB Link"
                          v-if="
                            template.get(cid) == 0 || template.get(scid) == 0
                          "
                          rules="required"
                        >
                          <v-text-field
                            slot-scope="{ errors, valid }"
                            prepend-icon="mdi-lock"
                            v-if="
                              template.get(cid) == 0 || template.get(scid) == 0
                            "
                            v-model="torrent.imdb_link"
                            :error-messages="errors"
                            :success="valid"
                            :counter="30"
                            label="IMDB Link"
                          ></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider
                          name="Description"
                          rules="required"
                          class="px-4"
                        >
                          <tiptap />
                        </ValidationProvider>
                      </v-form>
                      <v-btn
                        class="mx-4 my-1"
                        color="primary"
                        @click="submitTorrent()"
                      >
                        Submit
                      </v-btn>

                      <v-btn text class="mx-4 my-1" @click="e1 = 1">
                        Back
                      </v-btn>
                    </ValidationObserver>
                  </v-stepper-content>

                  <v-stepper-content step="3">
                    <v-card class="mb-12" color="grey lighten-1" height="200px">
                      {{ result }}
                    </v-card>

                    <v-btn color="primary" class="mx-4 my-1" @click="e1 = 1">
                      Continue
                    </v-btn>

                    <v-btn text class="mx-4 my-1" @click="e1 = 2"> Back </v-btn>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-card-text>
          </v-card>

          <v-dialog v-model="dialog" width="500">
            <v-card>
              <v-card-title class="text-h5 red white--text elevation-5">
                Error
              </v-card-title>

              <v-card-text>
                {{ error_message }}
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                  I accept
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";

import { required, confirmed, mimes } from "vee-validate/dist/rules";

import Tiptap from "./Tiptap.vue";

import Torrent from "../models/torrent";

import UploadService from "../services/upload.service";
import AuthService from "../services/auth.service";

extend("mimes", {
  ...mimes,
  message: "Please select a valid torrent file.",
});

extend("confirmed", {
  ...confirmed,
  message: "Two passwords aren't consistent.",
});

extend("min", {
  validate(value, { min }) {
    return value.length >= min;
  },
  params: ["min"],
  message: "The {_field_} must have at least {min} characters",
});

extend("max", {
  validate(value, { max }) {
    return value.length <= max;
  },
  params: ["max"],
  message: "The {_field_} must have at most {max} characters",
});

extend("required", {
  ...required,
  message: "This field is required",
});

export default {
  data: () => ({
    e1: 1,
    torrent: new Torrent("", "", "", "", 0, "", ""),
    torrentfile: null,
    dialog: false,
    error_message: "",
    uploaded: false,
    uploading: false,
    result: "",
    categories: [],
    sub_categories: [],
    template: new Map(),
    cid: 1,
    scid: 0,
  }),
  components: {
    ValidationProvider,
    ValidationObserver,
    Tiptap,
  },
  methods: {
    async fillCategories() {
      const _categories = JSON.parse(localStorage.getItem("categories"));
      _categories.forEach((i) => {
        this.categories.push({
          value: i.cid,
          text: i.name,
        });
        this.template.set(i.cid, i.template_id);
      });
    },
    async fillSubCategories() {
      this.scid = 0;
      this.sub_categories = new Array();
      const _categories = JSON.parse(localStorage.getItem("categories"));
      _categories.forEach((i) => {
        if (i.cid == this.cid) {
          i.subcategory.forEach((j) => {
            this.sub_categories.push({
              value: j.cid,
              text: j.name,
            });
            this.template.set(j.cid, j.template_id);
          });
        }
      });
    },
    async submitFile() {
      await this.$refs.obs1.validate();
      let torrentFile = new FormData();
      torrentFile.append("file", this.torrentfile);
      this.uploading = true;
      UploadService.upload(torrentFile).then((response) => {
        if (response.name == "Error") {
          this.uploading = false;
          this.uploaded = false;
          this.error_message =
            "Upload failed, please check your network and try again.";
          this.dialog = true;
          return;
        }
        this.torrent.name = response.name;
        this.torrent.file_id = response.id;
        this.uploaded = true;
        this.uploading = false;
        this.e1 = 2;
      });
    },
    async clearFile() {
      this.torrentfile = null;
      this.uploaded = false;
      this.torrent = new Torrent("", "", "", "", "", "", "");
    },
    async submitTorrent() {
      await this.$refs.obs2.validate();
      if (this.scid != 0) {
        this.torrent.category = this.scid;
      } else {
        this.torrent.category = this.cid;
      }
      AuthService.session
        .post("/api/torrent/create_torrent", this.torrent, {})
        // TODO: Torrent already exists
        .then((response) => {
          if (response.status == 200) {
            console.log(response);
            AuthService.session
              .get("/api/torrent/torrent_detail/" + response.data.id)
              .then((response) => {
                this.result = JSON.stringify(response.data);
              });
            this.e1 = 3;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fillCategories();
    this.fillSubCategories();
  },
};
</script>
