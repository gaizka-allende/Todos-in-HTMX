import i18next from 'i18next'

export default (async () => {
  await i18next.init({
    //lng: 'en',
    //debug: true,
    resources: {
      en: {
        translation: {
          document_title: 'Todos',
          select_a_theme: 'Select a theme',
          light: 'Light',
          dark: 'Dark',
          system: 'System',
          translations_loaded: 'translations loaded',
          invalid_username_in_session: 'Invalid user name in session',
          invalid_username_or_password: 'Invalid username or password',
          username_must_contain_only_letters_or_numbers:
            'Username must contain only letters or numbers',
          username_must_be_at_least_6_characters_long:
            'Username must be at least 6 characters long',
          username_must_be_at_most_20_characters_long:
            'Username must be at most 20 characters long',
          password_is_required: 'Password is required',
          password_must_be_at_least_8_characters_long:
            'Password must be at least 8 characters long',
          password_must_be_at_most_20_characters_long:
            'Password must be at most 20 characters long',
          re_enter_password_is_required: 'Re-enter password is required',
          the_passwords_did_not_match: 'The passwords did not match',
          user_already_exists: 'User already exists',
          todo_delete: 'Delete',
          todo: 'Todo',
          add: 'Add',
          yesterday: 'Yesterday',
          two_days_ago: 'Two days ago',
          three_days_ago: 'Three days ago',
          four_days_ago: 'Four days ago',
          five_days_ago: 'Five days ago',
          six_days_ago: 'Six days ago',
          last_week: 'Last week',
          more_than_two_weeks_ago: 'More than two weeks ago',
          completed: 'Completed',
          select_a_language: 'Select a language',
          username: 'Username',
          password: 'Password',
          login: 'Login',
          re_enter_password: 'Re-enter password',
          register: 'Register',
          task_must_be_at_least_5_characters_long:
            'Task must be at least 5 characters long',
        },
      },
      es: {
        translation: {
          document_title: 'Tareas',
          select_a_theme: 'Selecciona un tema',
          light: 'Claro',
          dark: 'Oscuro',
          system: 'Sistema',
          translations_loaded: 'traducciones cargadas',
          invalid_username_in_session:
            'Nombre de usuario no válido en la sesión',
          invalid_username_or_password:
            'Nombre de usuario o contraseña no válidos',
          username_must_contain_only_letters_or_numbers:
            'El nombre de usuario debe contener solo letras o números',
          username_must_be_at_least_6_characters_long:
            'El nombre de usuario debe tener al menos 6 caracteres',
          username_must_be_at_most_20_characters_long:
            'El nombre de usuario debe tener como máximo 20 caracteres',
          password_is_required: 'Se requiere contraseña',
          password_must_be_at_least_8_characters_long:
            'La contraseña debe tener al menos 8 caracteres',
          password_must_be_at_most_20_characters_long:
            'La contraseña debe tener como máximo 20 caracteres',
          re_enter_password_is_required:
            'Se requiere volver a ingresar la contraseña',
          the_passwords_did_not_match: 'Las contraseñas no coinciden',
          user_already_exists: 'El usuario ya existe',
          todo_delete: 'Eliminar',
          todo: 'Tarea',
          add: 'Agregar',
          yesterday: 'Ayer',
          two_days_ago: 'Hace dos días',
          three_days_ago: 'Hace tres días',
          four_days_ago: 'Hace cuatro días',
          five_days_ago: 'Hace cinco días',
          six_days_ago: 'Hace seis días',
          last_week: 'La semana pasada',
          more_than_two_weeks_ago: 'Hace más de dos semanas',
          completed: 'Completado',
          select_a_language: 'Selecciona un idioma',
          username: 'Nombre de usuario',
          password: 'Contraseña',
          login: 'Iniciar sesión',
          re_enter_password: 'Vuelve a ingresar la contraseña',
          register: 'Registrarse',
          task_must_be_at_least_5_characters_long:
            'La tarea debe tener al menos 5 caracteres',
        },
      },
    },
  })
  return i18next
})()

export let t = i18next.getFixedT('en')
