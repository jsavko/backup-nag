/**
 * Registers the report on chatmessage
 */
Hooks.once('init', () => {
    console.log("Backup Nag Loaded");
});

Hooks.once('ready', () => {
  if (game.user.isGM){
    let check_nag = game.user.getFlag("backup-nag", "next_nag");
      if (check_nag != -1 ) {
        const d = new Date();
        if (d.getTime() >= check_nag) {
          makeDialog();
        }
      }
  }
});


async function makeDialog() { 
  const dialog_html = await renderTemplate("modules/backup-nag/templates/dialog.hbs");

  new Dialog({
    title: `Backup Time!`,
    content: dialog_html,
    buttons: {
      ok: {
        label: "Done",
        callback: async (html) => {
            //Do the thing;
            let remind = html.find('input[name="remind"]:checked').val();
            if (remind == "-1"){ 
                //Set reminder to never
                game.user.setFlag("backup-nag", "next_nag", "-1");
            } else { 
                let days = html.find('#count_days').val();
                console.log(days);
                const d = new Date();
                let new_date = d.getTime() + (864E5*days)
                // Set reminder for X days
                game.user.setFlag("backup-nag", "next_nag", new_date);
            }

        },
      }
    },
  }).render(true);
}