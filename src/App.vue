<template>
  <v-app>
    <!-- System toolbar -->
    <v-system-bar
      v-if="process.platform != 'darwin'"
      app
      window
      style="-webkit-app-region: drag; -webkit-user-select: none"
      height="38"
      color="#06224B"
      class="pr-0"
    >
      <v-fade-transition group leave-absolute>
        <div
          key="logo"
          v-if="!$root.notify.is"
          style="display: inline-flex !important; margin-left: 2px"
        >
          <img
            src="./assets/logo.png"
            style="margin-right: 4px; margin-top: 3px; height: 18px"
          />
          <span style="margin-top: 2px">Satellite</span>
          <!-- <span class="font-weight-light grey--text lighten-2 mr-2 hidden-xs-only">early-access beta</span> -->
        </div>
        <span
          key="notification"
          v-if="$root.notify.is"
          v-html="$root.notify.text"
        ></span>
      </v-fade-transition>
      <v-spacer></v-spacer>
      <div style="-webkit-app-region: no-drag; margin-bottom: 1px">
        <v-icon @click="minimize()" v-ripple class="toolbar-icon"
          >mdi-minus</v-icon
        >
        <v-icon
          @click="maximized ? unmaximize() : maximize()"
          v-ripple
          class="toolbar-icon"
          >mdi-crop-square</v-icon
        >
        <v-icon @click="close()" v-ripple class="toolbar-icon"
          >mdi-close</v-icon
        >
      </div>
    </v-system-bar>

    <v-system-bar
      v-if="process.platform == 'darwin'"
      app
      window
      style="-webkit-app-region: drag"
      height="38"
      color="#06224B"
    >
      <div
        style="height: 12px; width: 12px; border-radius: 12px"
        v-ripple
        @click="close()"
        class="red mx-1"
      ></div>
      <div
        style="height: 12px; width: 12px; border-radius: 12px"
        v-ripple
        @click="minimize()"
        class="yellow darken-2 mx-1"
      ></div>
      <div
        style="height: 12px; width: 12px; border-radius: 12px"
        v-ripple
        @click="maximized ? unmaximize() : maximize()"
        class="green mx-1"
      ></div>
      <v-fade-transition group leave-absolute style="margin: 4px 4px 0px 10px">
        <div
          key="logo"
          v-if="!$root.notify.is"
          style="display: inline-flex !important"
        >
          <img
            src="./assets/logo.png"
            style="height: 24px; margin-right: 4px; margin-top: 1px"
          />
          <span style="margin-right: 4px; margin-top: 3px">Satellite</span>
          <!-- <span class="font-weight-light grey--text lighten-2 mr-2 hidden-xs-only">early-access beta</span> -->
        </div>
        <p
          key="notification"
          v-if="$root.notify.is"
          class="mb-1"
          v-html="$root.notify.text"
        ></p>
      </v-fade-transition>
    </v-system-bar>

    <!-- Site content -->
    <v-main key="webview">
      <v-toolbar color="#06224B" dense>
        <v-btn
          v-if="$refs.webview"
          :disabled="!$refs.webview.canGoBack()"
          icon
          @click="$refs.webview.goBack()"
          ><v-icon>mdi-chevron-left</v-icon></v-btn
        >
        <v-btn
          v-if="$refs.webview"
          :disabled="!$refs.webview.canGoForward()"
          icon
          @click="$refs.webview.goForward()"
          ><v-icon>mdi-chevron-right</v-icon></v-btn
        >
        <v-btn icon @click="$refs.webview.reload()"
          ><v-icon>mdi-reload</v-icon></v-btn
        >
        <input
          class="ml-3"
          spellcheck="false"
          placeholder="URL"
          v-model="url"
          @keypress.enter="
            url.includes('satellite://') ? (url = url) : (url_displayed = url)
          "
          style="width: 100%"
        />
      </v-toolbar>
      <webview
        v-show="!url.includes('satellite://')"
        ref="webview"
        class="page"
        :src="url_displayed"
        autosize="on"
      ></webview>
      <div class="page" v-show="url.includes('satellite://')">
        <div class="newtab" v-if="url == 'satellite://new'">
          <v-text-field
            @keyup.enter="
              $refs.webview.loadURL(
                `https://duckduckgo.com/?q=${encodeURIComponent(search)}`
              );
              url = `https://duckduckgo.com/?q=${encodeURIComponent(search)}`;
              search = '';
            "
            solo
            placeholder="Search..."
            v-model="search"
            style="max-width: 750px; margin: auto; padding: 10% 24px"
          ></v-text-field>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { remote } from "electron";
import axios from "axios";

export default {
  name: "app",
  components: {},
  data() {
    return {
      win: remote.getCurrentWindow(),
      maximized: remote.getCurrentWindow().isMaximized(),
      process,
      console,
      url: "satellite://new",
      url_displayed: "satellite://new",
      search: "",
      encodeURIComponent,
    };
  },
  methods: {
    close() {
      if (this.$root.data && !this.$root.view.close_confirm_and_quit)
        this.$root.view.close_confirm_and_quit = true;
      else this.win.close();
    },
    maximize() {
      this.win.maximize();
      this.maximized = remote.getCurrentWindow().isMaximized();
    },
    unmaximize() {
      this.win.unmaximize();
      this.maximized = remote.getCurrentWindow().isMaximized();
    },
    minimize() {
      this.win.minimize();
    },
  },
  mounted() {
    this.$refs.webview.addEventListener("did-navigate", () => {
      this.url = this.$refs.webview.src;
    });
    this.$refs.webview.addEventListener("did-navigate-in-page", () => {
      this.url = this.$refs.webview.src;
    });
    this.$refs.webview.addEventListener("update-target-url", () => {
      this.url = this.$refs.webview.src;
    });
  },
};
</script>

<style>
/* Scrollbar */

/* width */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(33, 33, 33);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(100, 100, 100);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(60, 60, 60);
}

/* Corner */
::-webkit-scrollbar-corner {
  background: rgb(33, 33, 33);
}

html {
  overflow-y: auto !important;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.appbar-icon {
  border-radius: 100px;
}

.centralize {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

* {
  outline: none;
}

input,
textarea {
  color: white;
}

webview {
  width: 100%;
  height: 100%;
}

.page {
  width: 100%;
  height: calc(100vh - 86px);
}
</style>
