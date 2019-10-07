<template>
  <span
    id="data"
    name="contact"
  >
    <div class="d-flex justify-content-center">
      <div class="p-2">
        <div class="page-header">
          <h2>Contact <small>US</small></h2>
        </div>

        <address
          class="pull-left"
          style="width:300px"
        >
          <strong>The Best Company</strong><br>
          111 Swell Ave. Suite 105<br>
          Middle, Earth 11111
        </address>

        <address class="pull-right">
          <abbr
            title="Phone"
            class="mr-2"
          >Phone:</abbr>800 555-5555<br>
          <abbr
            title="Phone"
            class="mr-3"
          >Local:</abbr>517 555-1212<br>
          <abbr
            title="Phone"
            class="mr-4"
          >Fax: </abbr> 800 555-1212<br>
          <abbr
            title="Phone"
            class="mr-3"
          >Email:</abbr><a href="mailto:info@best.com">info@best.com</a>
        </address>

        <div class="clearfix" />

        <form
          action="#"
          method="post"
          class="form-horizontal"
        >

          <fieldset>
            <legend>Via Email:</legend>  
                    
            <div class="control-group required">
              <div class="control-label">Name</div>
              <div class="controls">
                <input
                  id="inputName"
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                >
              </div>
                        
            </div>
                    
            <div class="control-group mt-2 required">
              <div class="control-label">Email</div>
              <div class="controls">
                <div class="input-prepend">
                  <input
                    id="inputEmail"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  >
                </div>
                            
              </div>
            </div>

            <div class="control-group">
              <div class="control-label mt-2">Reason</div>
              <div class="controls">
                <select
                  id="inputReason"
                  name="reason"
                >
                  <option value="general">General</option>
                  <option value="delivery">Delivery</option>
                  <option value="returns">Returns</option>
                  <option value="quality">Quality</option>
                </select>
              </div>
            </div>
            <div class="control-group mt-2 required">
              <div class="control-label">Description</div>
              <div class="controls">
                <textarea
                  id="inputComment"
                  name="comment"
                  placeholder="Description"
                  required
                />
              </div>
            </div>
            <div class="control-group">
              <div class="controls">
                <div class="checkbox">
                  <input
                    name="only"
                    type="checkbox"
                  > No Reply Required
                </div>
              </div>
            </div>
            <div class="control-group mt-2">
              <div class="controls contact-submit">
                <input
                  type="submit"
                  value="Submit"
                  class="btn"
                >
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div style="width:150px" />
    </div>
  </span>
</template>

<script>

import App from "app";
import SetUp from "setup";

export default {
  name: "ContactC",
  mounted: function () {
    this.$nextTick(function () {
        const el = $("#data");
        this.loadStart(el);
        SetUp.init();
    });
  },
  methods: {
    loadStart (el) {
        const controllerName = "Start";
        const actionName = "init";
        const failMsg = `Load problem with: '${controllerName}/${actionName}'.`;
        App.loadController(controllerName, {}, controller => {
            if (controller &&
                controller[actionName]) {
                    controller.initMenu();
                    controller.contactListener(el, controller);
            } else {
                console.error(failMsg);
            }
        }, err => {
            console.error(`${failMsg} - ${err}`);
        });
    }
  }
};
</script>