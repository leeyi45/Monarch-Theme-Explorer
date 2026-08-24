import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import Autocomplete from '@mui/material/Autocomplete';
import Backdrop from '@mui/material/Backdrop';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { debounce } from 'es-toolkit';
import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import ThemeConfig from './components/ThemeConfig/ThemeConfig';
import Editor from './editor/Editor';
import { sourceAcademyEditorTheme } from './editor/theme';
import { languages, stringifyMonarchGrammar } from './languages';
import type { ILanguageDefinition } from './languages/types';

function getMonarchEditorDefaultValue(langDef: ILanguageDefinition): string {
  const localStorageItem = localStorage.getItem('Monarch Editor');
  if (localStorageItem !== null) return localStorageItem;

  if (typeof langDef.monarchGrammar === 'string') return '';
  return 'return ' + stringifyMonarchGrammar(langDef.monarchGrammar);
}

export default function App() {
  const [languageDef, setLanguageDef] = useState<ILanguageDefinition>(() => {
    const localStorageItem = localStorage.getItem('langId');
    if (localStorageItem === null) return languages[0];

    const foundLang = languages.find(({ id }) => id === localStorageItem);
    return foundLang ?? languages[0];
  });

  const [monarchError, setMonarchError] = useState<string | null>(null);

  /**
   * `true` when the monarch value has changed on being loaded.
   * `false` when the monarch value hasn't changed.
   * `resetting` when the monarch value changed due to the editor being reset.
   */
  const [monarchHasChanges, setMonarchHasChanges] = useState<boolean | 'resetting'>(false);

  /**
   * Set backdrop to false to hide the backdrop
   * Set it to the language its supposed to change to to show the backdrop. If the confirm
   * is clicked language gets changed
   */
  const [resetBackdrop, setResetBackdrop] = useState<false | ILanguageDefinition>(false);

  const monarchEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monarchEditorValue = monarchEditorRef.current?.getValue();

  const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (monarchEditorValue === null) return;

    if (monarchHasChanges === 'resetting') {
      setMonarchHasChanges(false);
      return;
    }

    setMonarchHasChanges(true);
  }, [monarchEditorValue]);

  const onMonarchEditorUpdate = debounce((newValue: string) => {
    localStorage.setItem('Monarch Editor', newValue);

    let newGrammar: any;
    try {
      newGrammar = new Function(newValue)();
      setMonarchError(null);
    } catch (error: any) {
      setMonarchError(error.toString());
    }

    if (newGrammar) {
      monaco.languages.setMonarchTokensProvider(languageDef.id, newGrammar);
    }
  }, 200);

  const beginChangeLanguageDef = (langDef: ILanguageDefinition) => {
    if (monarchHasChanges === false) {
      endChangeLanguageDef(langDef);
    } else if (monarchHasChanges === true) {
      setResetBackdrop(langDef);
    }
  };

  /**
   * Actually change the current language definition in use
   */
  const endChangeLanguageDef = (langDef: ILanguageDefinition) => {
    setLanguageDef(langDef);

    if (typeof langDef.monarchGrammar === 'string') return;

    const stringified = 'return ' + stringifyMonarchGrammar(langDef.monarchGrammar);
    setMonarchHasChanges('resetting');
    monarchEditorRef.current?.setValue(stringified);
  };

  const monarchEditor = (
    <Stack direction="column" sx={{ height: '100vh' }} spacing={1}>
      <Editor
        language='typescript'
        theme='source'
        onValueChange={onMonarchEditorUpdate}
        defaultValue={getMonarchEditorDefaultValue(languageDef)}
        ref={monarchEditorRef}
      />
      <Paper>
        <code style={{
          padding: '5px 5px 5px 5px',
          color: monarchError === null ? 'unset' : 'red'
        }}>{monarchError === null ? 'No Error' : monarchError}</code>
      </Paper>
    </Stack>
  );

  const monarchEditorToolbar = (
    <Stack direction="row" sx={{ alignItems: 'center' }}>
      <Typography>Monarch Editor</Typography>
      <Tooltip title="Reset the Monarch Grammar">
        <IconButton onClick={() => beginChangeLanguageDef(languageDef)}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Save your changes">
        <IconButton>
          <Badge
            invisible={monarchHasChanges !== true}
            badgeContent='!'
            color='primary'
            overlap='circular'
          >
            <SaveIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const monarchChangeConfirmComponents = (
    <Paper>
      <div style={{ padding: '5px 5px 5px 5px'}} >
        <Stack direction='column' spacing={1}>
          <Typography>Are you sure you want to clear your Monarch code?</Typography>
          <Stack
            direction='row'
            sx={{ justifyContent: 'center' }}
            spacing={2}
          >
            <Button
              startIcon={<DoneIcon />}
              variant='outlined'
              color='success'
              onClick={() => endChangeLanguageDef(resetBackdrop as ILanguageDefinition)}
            >
              Yes
            </Button>
            <Button
              startIcon={<CloseIcon />}
              variant='outlined'
              color='error'
              onClick={() => setResetBackdrop(false)}
            >
              No
            </Button>
          </Stack>
        </Stack>
      </div>
    </Paper>
  );

  const codeEditor = (
    <Editor
      theme='source'
      language={languageDef.id}
      defaultValue={localStorage.getItem('Code Editor') ?? ''}
      onValueChange={newValue => {
        localStorage.setItem('Code Editor', newValue);
      }}
      ref={codeEditorRef}
    />
  );

  const codeEditorToolbar = (
    <Stack direction="row" sx={{ alignItems: 'center '}}>
      <Typography>Code Editor</Typography>
      <Tooltip title="Reset Code Editor">
        <IconButton onClick={() => {
          codeEditorRef.current?.setValue(languageDef.defaultProgram);
        }}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const navbar = (
    <Toolbar>
      <Paper sx={{ bgcolor: '#777777' }}>
        <div style={{ padding: '5px 5px 5px 5px' }}>
          <Grid container sx={{ width: '100vw' }}>
            <Grid size={2}>
              <Autocomplete
                fullWidth
                options={languages}
                renderInput={props => <TextField {...props} />}
                getOptionLabel={({ name }) => name}
                value={languageDef}
                size='small'
                onChange={(_e, newLang) => {
                  if (newLang === null) return;
                  beginChangeLanguageDef(newLang);
                }}
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
    </Toolbar>
  );

  return <>
    <Backdrop
      open={resetBackdrop !== false}
      onClick={() => setResetBackdrop(false)}
      sx={{
        zIndex: 10
      }}
    >
      {monarchChangeConfirmComponents}
    </Backdrop>
    <Grid
      container
      columns={12}
      columnSpacing={1}
      sx={{ height: '100vh' }}
    >
      <Grid size={12}>
        <Typography variant='h4'>
          Monarch Theme Explorer
        </Typography>
      </Grid>
      <Grid size={12}>{navbar}</Grid>
      <Grid size={5}>{monarchEditorToolbar}</Grid>
      <Grid size={5}>{codeEditorToolbar}</Grid>
      <Grid size={2} />
      <Grid size={5}>{monarchEditor}</Grid>
      <Grid size={5}>{codeEditor}</Grid>
      <Grid size={2}>
        <ThemeConfig
          themeId='source'
          theme={sourceAcademyEditorTheme}
        />
      </Grid>
    </Grid>
  </>;
}
