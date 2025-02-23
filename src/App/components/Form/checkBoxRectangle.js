import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { grey} from '@material-ui/core/colors';
import Checkbox from '@material-ui/core/Checkbox';

const GreyCheckbox = withStyles({
    root: {
      color: grey[900],
      '&$checked': {
        color: grey[900],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  export default GreyCheckbox;