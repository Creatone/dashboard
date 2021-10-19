import { Resource } from '@/plugins/core-store/resource-class';
import { epinioExceptionToErrorsArray } from '@/products/epinio/utils/errors';
import Vue from 'vue';

export const APPLICATION_ACTION_STATE = {
  SUCCESS: 'success',
  RUNNING: 'running',
  FAIL:    'fail',
  PENDING:  'pending',
};

export const APPLICATION_ACTION_TYPE = {
  CREATE: 'create',
  UPLOAD: 'upload',
  BUILD:    'build',
  DEPLOY: 'deploy',
};

export default class ApplicationActionResource extends Resource {
  // Props ---------------------------------------------------
  run = true;
  state = APPLICATION_ACTION_STATE.PENDING;

  get name() {
    return this.t(`epinio.applications.action.${ this.action }.label`);
  }

  get description() {
    return this.t(`epinio.applications.action.${ this.action }.description`);
  }

  get stateObj() {
    switch (this.state) {
    case APPLICATION_ACTION_STATE.SUCCESS:
      return {
        name:          'succeeded',
        error:         false,
        transitioning: false,
      };
    case APPLICATION_ACTION_STATE.RUNNING:
      return {
        name:          'pending',
        error:         false,
        transitioning: true,
      };
    case APPLICATION_ACTION_STATE.FAIL:
      return {
        name:          'fail',
        error:         true,
        transitioning: false,
        message:       this.stateMessage
      };
    case APPLICATION_ACTION_STATE.PENDING:
    default:
      return {
        name:          'pending',
        error:         false,
        transitioning: false,
      };
    }
  }

  // Private ---------------------------------------------------

  async innerExecute(params) {
    switch (this.action) {
    case APPLICATION_ACTION_TYPE.CREATE:
      await this.create(params);
      break;
    case APPLICATION_ACTION_TYPE.UPLOAD:
      await this.upload(params);
      break;
    case APPLICATION_ACTION_TYPE.BUILD:
      await this.build(params);
      break;
    case APPLICATION_ACTION_TYPE.DEPLOY:
      await this.deploy(params);
      break;
    }
  }

  async create() {
    await this.application.create();
  }

  async upload({ source }) {
    await this.application.storeArchive(source.tarball);
  }

  async build({ source }) {
    const { stage } = await this.application.stage(this.application.buildCache.store.blobUid, source.builderImage);

    this.application.showStagingLog(stage.id);

    await this.application.waitForStaging(stage.id);
  }

  async deploy() {
    this.application.showAppLog();
    await this.application.deploy(this.application.buildCache.stage.stage.id, this.application.buildCache.stage.image);
  }

  // Public ---------------------------------------------------

  async execute(params) {
    try {
      Vue.set(this, 'state', APPLICATION_ACTION_STATE.RUNNING);

      await this.innerExecute(params);

      Vue.set(this, 'state', APPLICATION_ACTION_STATE.SUCCESS);
      Vue.set(this, 'run', false);
    } catch (err) {
      Vue.set(this, 'state', APPLICATION_ACTION_STATE.FAIL);
      Vue.set(this, 'stateMessage', epinioExceptionToErrorsArray(err)[0].toString());

      throw err;
    }
  }
}
