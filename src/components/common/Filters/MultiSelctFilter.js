import {useState, useEffect} from 'react';
import useStyles from "./style";
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '../Checkbox';
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Fade from '@mui/material/Fade'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {ReactComponent as DownIcon} from '../../../assets/images/chevron-down.svg';
import SearchIcon from '@mui/icons-material/SearchRounded';

const MultiSelctFilter = ({
    arrayList, filterName, title, saveButtonText, clearButtonText, onChangeFilter, value, filterOn = 'name', disabled
}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [checkedArray, setCheckedArray] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Method used for handle menu click
     */
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    /**
     * Function is triggered when component received updated value
     */
    useEffect(() => {
        setCheckedArray(value);
    }, [value]);

    /**
     * Method used for handle the onchange event of text element
     */
    const handleChangeInput = (event) => {
        setSearchQuery(event.target.value);
    };

    /**
     * Method used for handle the onchange event of checkbox element
     */
    const handleChange = (event) => {
        const data = Object.assign([], JSON.parse(JSON.stringify(checkedArray)));
        if (event.target.checked) {
            data.push(event.target.name);
        } else {
            const findIndex = data.findIndex((item) => item === event.target.name);
            if (findIndex > -1) {
                data.splice(findIndex, 1);
            }
        }
        setCheckedArray(data);
    };

    /**
     * Method used apply the filter
     */
    const onApplyFilter = () => {
        const data = Object.assign([], JSON.parse(JSON.stringify(checkedArray)));
        onChangeFilter(data);
        setAnchorEl(null);
        setOpen(false);
    };

    /**
     * Method used for clear the filter value
     */
    const onClearFilter = (event) => {
        if (event) {
            event.stopPropagation();
        } else {
        }
        onChangeFilter([]);
        setAnchorEl(null);
        setOpen(false);
    };

    /**
     * Method used for handle click event on outside the menu
     */
    const clickAwayHandler = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    if (arrayList && arrayList.length > 0) {
        arrayList = arrayList.map((item) => {
            if (item.name === undefined) {
                item.name = item.label || `${item.firstName} ${item.lastName ? item.lastName : ''}`;
            }
            return item;
        });
    }

    const search = new RegExp(searchQuery, 'i'); // prepare a regex object
    const filterArray = arrayList && arrayList.length > 0 ? arrayList.filter((item) => search.test(item.name)) : [];

    return (
        <>
            {
                open && (
                    <ClickAwayListener onClickAway={() => clickAwayHandler()}>
                        <Popper open={open} anchorEl={anchorEl} placement="bottom-start" transition
                                className={classes.popperContainerMultiselect}>
                            {({TransitionProps}) => (
                                <Fade {...TransitionProps}>
                                    <Paper className={classes.menuPaper}>
                                        <Typography variant="h6" className={classes.marginBottom10}>{title}</Typography>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}
                                              className={`${classes.marginTop10} ${classes.marginBottom10}`}>
                                            <TextField
                                                size='small'
                                                fullWidth
                                                // label="Search"
                                                className={classes.marginTop10}
                                                placeholder="Search"
                                                name="searchQuery"
                                                value={searchQuery}
                                                onChange={handleChangeInput}
                                                InputProps={{
                                                    startAdornment: <InputAdornment
                                                        position="start"><SearchIcon/></InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                        <Grid container spacing={1} className={classes.checkboxOptionsContainer}>
                                            {
                                                filterArray && filterArray.length > 0
                                                ?(
                                                    <>
                                                        {
                                                            filterArray.map((item, index) => (
                                                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}
                                                                      key={`${item[filterOn]}-${index}`}>
                                                                    <FormControlLabel
                                                                        className={classes.formControlLabelAlign}
                                                                        control={
                                                                            <Checkbox
                                                                                checked={!!checkedArray.find((checkedItem) => checkedItem === item[filterOn])}
                                                                                className={classes.categoryCheckbox}
                                                                                onChange={handleChange}
                                                                                name={item[filterOn]}
                                                                            />
                                                                        }
                                                                        label={item.name || item.label || item.firstName + ' ' + item.lastName}
                                                                    />
                                                                </Grid>
                                                            ))
                                                        }
                                                    </>
                                                ):(
                                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                                            <Typography variant='body1' style={{margin: '30px 0px', textAlign: 'center'}}>
                                                                No data available
                                                            </Typography>
                                                        </Grid>
                                                )
                                            }
                                        </Grid>
                                        <Grid container spacing={1}>
                                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className={classes.marginTop10}>
                                                <Stack direction="row" spacing={1.5} mt={1} justifyContent="flex-end">
                                                    <Button
                                                        variant="contained"
                                                        color="inherit"
                                                        onClick={(e) => onClearFilter(e)}
                                                        size="small"
                                                    >
                                                        {clearButtonText}
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => onApplyFilter()}
                                                        size="small"
                                                    >
                                                        {saveButtonText}
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>
                    </ClickAwayListener>
                )
            }
            <Chip
                className={`${classes.marginRight10} ${classes.marginBottom10}`}
                disabled={disabled}
                color={`${value.length > 0 ? "primary" : "default"}`}
                variant={`${value.length > 0 ? "outlined" : "contained"}`}
                onClick={handleClickMenu}
                label={filterName}
                size="medium"
                onDelete={() => {}}
                deleteIcon={<DownIcon />}
            >
                {/*{`${filterName}: ${value.length > 0 && value.length !== arrayList.length ? '(' + value.length + ')' : 'All'}`}*/}
                {/*{value.length > 0 && <ClearFilterIcon className={classes.clearFilterIcon} onClick={(e) => onClearFilter(e)}/>}*/}
            </Chip>
        </>
    )

};

export default MultiSelctFilter;