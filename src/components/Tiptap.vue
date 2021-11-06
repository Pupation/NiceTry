<template>
  <v-card class="mx-2">
    <div v-if="editor">
      <div class="editor-toolbar">
        <v-toolbar>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                class="text-none"
                width="100px"
                outlined
              >
                {{ activeType }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="name in fontTypes"
                :key="name"
                @click="editor.chain().focus().setFontFamily(name).run()"
                link
              >
                <v-list-item-title :style="{ 'font-family': name }">{{
                  name
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                class="text-none mx-2"
                :color="fontColor"
                outlined
              >
                Color
              </v-btn>
            </template>
            <v-color-picker
              dot-size="25"
              hide-canvas
              hide-inputs
              hide-sliders
              mode="rgba"
              show-swatches
              swatches-max-height="200"
              v-model="color"
              @update:color="editor.chain().focus().setColor(colorHex).run()"
            ></v-color-picker>
          </v-menu>
          <v-divider vertical class="mx-1"></v-divider>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'v-btn--active': editor.isActive('bold') }"
          >
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'v-btn--active': editor.isActive('italic') }"
          >
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleStrike().run()"
            :class="{ 'v-btn--active': editor.isActive('strike') }"
          >
            <v-icon>mdi-format-strikethrough</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleUnderline().run()"
            :class="{ 'v-btn--active': editor.isActive('underline') }"
          >
            <v-icon>mdi-format-underline</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleCode().run()"
            :class="{ 'v-btn--active': editor.isActive('code') }"
          >
            <v-icon>mdi-code-tags</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().unsetAllMarks().run()"
          >
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
          <v-divider vertical class="mx-1"></v-divider>
          <v-btn
            small
            icon
            @click="editor.chain().focus().setTextAlign('left').run()"
            :class="{ 'v-btn--active': editor.isActive({ textAlign: 'left' }) }"
          >
            <v-icon>mdi-format-align-left</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().setTextAlign('center').run()"
            :class="{
              'v-btn--active': editor.isActive({ textAlign: 'center' }),
            }"
          >
            <v-icon>mdi-format-align-center</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().setTextAlign('right').run()"
            :class="{
              'v-btn--active': editor.isActive({ textAlign: 'right' }),
            }"
          >
            <v-icon>mdi-format-align-right</v-icon>
          </v-btn>
          <v-divider vertical class="mx-1"></v-divider>
          <v-btn
            small
            icon
            @click="editor.chain().focus().setParagraph().run()"
            :class="{
              'v-btn--active': editor.isActive('paragraph'),
            }"
          >
            <v-icon>mdi-format-paragraph</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{
              'v-btn--active': editor.isActive('heading', { level: 1 }),
            }"
          >
            <v-icon>mdi-format-header-1</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{
              'v-btn--active': editor.isActive('heading', { level: 2 }),
            }"
          >
            <v-icon>mdi-format-header-2</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{
              'v-btn--active': editor.isActive('heading', { level: 3 }),
            }"
          >
            <v-icon>mdi-format-header-3</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{
              'v-btn--active': editor.isActive('bulletList'),
            }"
          >
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{
              'v-btn--active': editor.isActive('orderedList'),
            }"
          >
            <v-icon>mdi-format-list-numbered</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{
              'v-btn--active': editor.isActive('codeBlock'),
            }"
          >
            <v-icon>mdi-code-braces</v-icon>
          </v-btn>
          <v-btn
            small
            icon
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{
              'v-btn--active': editor.isActive('blockquote'),
            }"
          >
            <v-icon>mdi-format-quote-close</v-icon>
          </v-btn>
          <v-divider vertical class="mx-1"></v-divider>
          <v-btn small icon @click="editor.chain().focus().undo().run()">
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn small icon @click="editor.chain().focus().redo().run()">
            <v-icon>mdi-redo</v-icon>
          </v-btn>
        </v-toolbar>
      </div>
    </div>
    <editor-content :editor="editor" class="content" />
  </v-card>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
      fontTypes: ["sans-serif", "serif", "monospace"],
      colorHex: "#000000",
    };
  },

  computed: {
    activeType: function () {
      if (this.editor.isActive("textStyle", { fontFamily: "sans-serif" })) {
        return "sans-serif";
      } else if (this.editor.isActive("textStyle", { fontFamily: "serif" })) {
        return "serif";
      } else if (
        this.editor.isActive("textStyle", { fontFamily: "monospace" })
      ) {
        return "monospace";
      } else {
        return "sans-serif";
      }
    },
    color: {
      get() {
        return this.fontColor;
      },
      set(v) {
        this["colorHex"] = v;
      },
    },
    fontColor() {
      if (this.editor.getAttributes("textStyle").color) {
        return this.editor.getAttributes("textStyle").color;
      } else {
        return "#000000";
      }
    },
  },

  mounted() {
    this.editor = new Editor({
      content: "<p>I’m running Tiptap with Vue.js. 🎉</p>",
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
          defaultAlignment: "left",
        }),
        TextStyle,
        FontFamily.configure({
          types: ["textStyle"],
        }),
        Color.configure({
          types: ["textStyle"],
        }),
      ],
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
.editor-toolbar {
  .v-toolbar {
    display: flex;
    height: auto !important;
    padding: 5px;
    .v-toolbar__content {
      height: auto !important;
      flex-wrap: wrap;
    }
  }
}

.content {
  text-align: left;
  margin: 4px 4px 4px 4px;
}
</style>
