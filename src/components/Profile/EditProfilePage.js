import React, { useState } from 'react';
import { useForm, useField } from 'react-final-form-hooks';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

import { makeStyles } from '@material-ui/core/styles';

import { ProfilePicture } from './utils';
import { ErrorText } from '../utils';

const sectionItem = {
  display: 'grid',
  gridAutoFlow: 'column',
  gridGap: 30,
  placeItems: 'start end',
  marginBottom: 16,
  gridTemplateColumns: 'minmax(auto, 150px) minmax(auto, 340px)'
};
const typography = {
  fontWeight: 600
};
const userNameDiv = {
  justifySelf: 'start'
};

const useSectionItemStyles = makeStyles(theme => ({
  typography,
  sectionItem: {
    ...sectionItem,
    [theme.breakpoints.down('xs')]: {
      display: 'unset'
    }
  },

  textFieldInput: {
    padding: 10
  }
}));

function SectionItem({ text, formItem }) {
  const classes = useSectionItemStyles();

  const textFieldProps = {
    ...formItem.input,
    variant: 'outlined',
    fullWidth: true,
    type: formItem.input.name === 'email' ? 'email' : 'text',
    inputProps: {
      className: classes.textFieldInput
    }
  };

  return (
    <div className={classes.sectionItem}>
      <aside>
        <Typography className={classes.typography}>{text}</Typography>
      </aside>
      <TextField {...textFieldProps} />
    </div>
  );
}

const usePictureSectionItemStyles = makeStyles(theme => ({
  userNameDiv,
  typography,

  pictureSectionItem: {
    ...sectionItem,
    [theme.breakpoints.down('xs')]: {
      gridGap: 20,
      gridTemplateColumns: 'minmax(auto, 38px) minmax(auto, 340px)'
    }
  }
}));

function PictureSectionItem({ user }) {
  const classes = usePictureSectionItemStyles();

  return (
    <div className={classes.pictureSectionItem}>
      <ProfilePicture size={38} />
      <div className={classes.userNameDiv}>
        <Typography className={classes.typography}>{user.userName}</Typography>
        <Typography color="primary" variant="body2">
          Change Profile Photo
        </Typography>
      </div>
    </div>
  );
}

const useEditProfileStyles = makeStyles(theme => ({
  section: {
    background: '#ffffff',
    display: 'grid',
    justifyContent: 'start',
    padding: 30
  },
  sectionItem: {
    ...sectionItem,
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    }
  },

  form: {
    display: 'grid'
  },

  typography,
  userNameDiv
}));

function EditProfile({ user }) {
  const classes = useEditProfileStyles();

  const onSubmit = () => {};
  const validate = ({ userName, fullName, bio, email, phoneNumber }) => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required.';
    }
    if (!fullName) {
      errors.fullName = 'Name is required.';
    } else if (fullName && fullName.length > 30) {
      errors.fullName = 'Enter a name under 30 characters.';
    }
    if (!userName) {
      errors.userName = 'Username is required.';
    } else if (userName && userName.length > 30) {
      errors.userName = 'Enter a username under 30 characters.';
    }

    if (bio && bio.length > 130) {
      errors.bio = 'Your bio must be 130 characters or fewer';
    }
    if (phoneNumber) {
      const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneNumber.match(regex)) {
        errors.bio = 'Enter a valid phone number';
      }
    }

    return errors;
  };
  const initialValues = {
    fullName: user.fullName || '',
    userName: user.userName || '',
    website: user.website || '',
    bio: user.bio || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || ''
  };

  const {
    form,
    handleSubmit,
    submitting,
    pristine,
    submitFailed,
    errors
  } = useForm({
    onSubmit,
    validate,
    initialValues
  });

  const fullName = useField('fullName', form);
  const userName = useField('userName', form);
  const website = useField('website', form);
  const bio = useField('bio', form);
  const email = useField('email', form);
  const phoneNumber = useField('phoneNumber', form);

  const textFieldProps = {
    ...bio.input,
    variant: 'outlined',
    multiline: true,
    rowsMax: 3,
    rows: 3,
    fullWidth: true
  };

  const buttonProps = {
    disabled: pristine || submitting,
    type: 'submit',
    variant: 'contained',
    color: 'primary',
    className: classes.userNameDiv
  };

  return (
    <section className={classes.section}>
      <PictureSectionItem user={user} />
      <form onSubmit={handleSubmit} className={classes.form}>
        <SectionItem text="Name" formItem={fullName} />
        <SectionItem text="Username" formItem={userName} />
        <SectionItem text="Website" formItem={website} />

        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.typography}>Bio</Typography>
          </aside>
          <TextField {...textFieldProps} />
        </div>

        <div className={classes.sectionItem}>
          <div />
          <Typography color="textSecondary" className={classes.userNameDiv}>
            Private information
          </Typography>
        </div>

        <SectionItem text="Email" formItem={email} />
        <SectionItem text="Phone Number" formItem={phoneNumber} />

        <div className={classes.sectionItem}>
          <div />
          <Button {...buttonProps}>Submit</Button>
        </div>
      </form>
      {submitFailed && <ErrorText text={Object.values(errors)[0]} />}
    </section>
  );
}

const useEditProfilePageStyles = makeStyles(theme => ({
  section: {
    display: 'grid',
    gridAutoFlow: 'column',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'minmax(48px, max-content) 0px auto'
    },
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'minmax(220px, max-content) auto'
    },
    border: '1px solid #dbdbdb'
  },

  permanentDrawerPaper: {
    borderRight: '1px solid #dbdbdb',
    left: 'unset',
    top: 'unset',
    position: 'relative'
  },
  permanentDrawerRoot: {
    height: '100%',
    '& div': {
      zIndex: 888
    }
  },
  temporaryDrawer: {
    '& div': {
      width: 220
    }
  },

  listItemSelected: {
    borderLeft: '2px solid black',
    '& span': {
      fontWeight: 600
    }
  },
  listItemButton: {
    paddingTop: 10,
    paddingBottom: 10
  },

  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    },
    marginLeft: 'unset',
    '&:hover': {
      background: 'none'
    }
  }
}));

function EditProfilePage({ user }) {
  const classes = useEditProfilePageStyles();
  const [selected, setSelected] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const options = [
    'Edit Profile',
    'Change password',
    'Authorized Applications',
    'Email and SMS',
    'Manage Contacts',
    'Privacy and Security'
  ];

  const drawer = (
    <List>
      {options.map((text, index) => {
        const listItemProps = {
          button: true,
          key: text,
          selected: index === selected,
          onClick: () => setSelected(index),
          classes: {
            selected: classes.listItemSelected,
            button: classes.listItemButton
          }
        };
        return (
          <ListItem {...listItemProps}>
            <ListItemText primary={text} />
          </ListItem>
        );
      })}
    </List>
  );

  const iconButtonprops = {
    edge: 'start',
    onClick: handleDrawerToggle,
    className: classes.menuButton,
    disableRipple: true
  };
  const temporaryDrawerProps = {
    variant: 'temporary',
    anchor: 'left',
    open: mobileOpen,
    onClose: handleDrawerToggle,
    classes: { paperAnchorLeft: classes.temporaryDrawer }
  };
  const permanentDrawerProps = {
    variant: 'permanent',
    open: true,
    classes: {
      paper: classes.permanentDrawerPaper,
      root: classes.permanentDrawerRoot
    }
  };
  const hiddenProps = {
    xsDown: true,
    implementation: 'css',
    className: classes.permanentDrawerRoot
  };

  return (
    <section className={classes.section}>
      <IconButton {...iconButtonprops}>
        <MenuIcon />
      </IconButton>
      <nav>
        <Hidden smUp implementation="css">
          <Drawer {...temporaryDrawerProps}>{drawer}</Drawer>
        </Hidden>
        <Hidden {...hiddenProps}>
          <Drawer {...permanentDrawerProps}>{drawer}</Drawer>
        </Hidden>
      </nav>
      <main>
        <EditProfile user={user} />
      </main>
    </section>
  );
}

export default EditProfilePage;