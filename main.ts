import app from '~/app';
import config from '~/app/config';
import "~/app/database"
import { getIpAddress } from '~/common/utils';

app.listen(config.APP_PROD, () => {
  console.log(`http://${getIpAddress()}:${config.APP_PROD}`)
})
