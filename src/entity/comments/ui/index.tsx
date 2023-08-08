import clsx from "clsx";
import React, { memo, useState } from "react";

import { TComment } from "../lib";

interface CommentsProps {
  opened: boolean;
  trackId: number;
}

export const Comments = memo<CommentsProps>(({ opened }) => {
  const [focus, setFocus] = useState(false);
  const comments: TComment[] = [];

  return (
    <div
      className={clsx(
        "static z-10 flex max-h-full transform flex-col space-y-2 overflow-hidden border bg-white transition-[opacity_transform_height_padding] duration-200",
        opened ? "opacity-1 h-full translate-y-0 pt-5" : "h-0 -translate-y-full opacity-0",
      )}
    >
      {comments.map((comment) => (
        <Comment key={comment.id} />
      ))}

      {comments.length <= 0 && (
        <div className="text-center italic text-gray-600 first-letter:uppercase">
          <span>пока нет комментариев</span>
        </div>
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col space-y-2  border-t border-t-gray-300 p-4"
      >
        <label htmlFor="">
          <span
            className={clsx("text-md text-gray-500 first-letter:capitalize", focus && "text-black")}
          >
            Новое сообщение
          </span>
        </label>
        <textarea
          className="resize-none rounded border border-gray-300 p-2 text-sm"
          rows={3}
          onFocus={() => setFocus((prev) => !prev)}
        />
        <button type="submit" className="btn btn-xs self-start">
          Отправить
        </button>
      </form>
    </div>
  );
});
Comments.displayName = "Comments";

export const Comment = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="grid grid-cols-10 items-start px-10">
      <div className="flex flex-col">
        <div className="placeholder avatar col-span-2">
          <div className="w-8 rounded-full bg-neutral-focus text-neutral-content">
            <span className="text-xs">AA</span>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "col-span-8 flex max-h-[64px] flex-col overflow-hidden text-xs",
          show && "max-h-min",
        )}
      >
        <span className="font-bold">Wilde Wilde</span>
        <span>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid non quam labore aliquam
          aspernatur beatae debitis, officia expedita eaque est molestiae dolorem, libero id
          voluptates quidem, dolore impedit perspiciatis cumque. Fugit, maiores. Esse odit totam
          distinctio obcaecati molestiae iste tempore tenetur! Quod minima laborum accusantium vitae
          deleniti. Officiis amet iste perferendis, beatae voluptate magni ducimus neque temporibus
          nemo ratione eveniet. Modi et enim repudiandae necessitatibus quo inventore distinctio
          sequi saepe ipsa consequuntur, quae, ex doloribus eligendi temporibus nulla qui nesciunt
          odit illum molestiae! Aspernatur repellat nisi repellendus recusandae quaerat accusantium?
          Atque impedit eligendi corporis iste magnam cumque quidem blanditiis accusamus tenetur
          commodi id vero quae dicta nihil laboriosam, rerum itaque similique quos nam repellendus
          ipsa tempore ex nisi obcaecati! Iusto. Error quidem necessitatibus numquam exercitationem!
          Itaque, repellat ut aut neque facere veniam praesentium cumque beatae sequi et ratione,
          amet modi magni doloremque suscipit ab recusandae soluta quisquam nesciunt optio delectus.
          Unde molestias iste expedita corporis mollitia quis totam, velit quam nihil distinctio
          magni ut maiores inventore debitis maxime aliquid ducimus adipisci quia voluptate, sint
          ipsam omnis iure optio? Hic, eum. Possimus consequatur nesciunt ipsum rem quia suscipit
          vitae animi voluptates delectus, necessitatibus quos odit libero vero quibusdam ratione
          eum praesentium debitis laborum eligendi natus. Animi doloremque atque amet numquam neque!
          Neque expedita ut quibusdam hic cumque vitae. Sequi itaque possimus velit tempore, sint
          alias nobis similique fugit explicabo tempora eaque ipsum ea incidunt distinctio sapiente
          quae optio dolores iste veniam. Perferendis odio in quaerat distinctio mollitia deleniti
          et amet debitis. Minus dolores laborum sunt magnam at fuga, excepturi, veniam aspernatur
          libero quam nihil facere eligendi itaque, nostrum fugiat. Labore, saepe. Iste, a quasi.
          Distinctio amet voluptatibus ad blanditiis tempore, fugit sint doloremque eveniet ratione
          impedit asperiores facere, culpa sed, natus officiis aliquam? Consequatur itaque
          reprehenderit quidem ex, aspernatur quibusdam dolor. Iste fuga neque deserunt. Debitis
          doloremque nemo harum mollitia eos laborum accusantium. Tenetur debitis nisi neque, quas
          vero non? Officia modi tenetur inventore voluptatum eum quod beatae minus ut? Sed.
          Commodi, exercitationem. Eius nihil, iure repudiandae, reprehenderit non aspernatur ipsa
          praesentium ipsum sapiente, porro dignissimos doloremque! Possimus, totam. Architecto
          libero soluta aliquam sapiente vero accusamus officiis! Quos consectetur cum vel? Commodi,
          quae expedita error, aspernatur voluptatem hic voluptate laudantium pariatur facere minima
          reiciendis id impedit? Et accusamus possimus, nostrum autem tempora commodi quibusdam
          itaque veritatis magni! Ut expedita quidem illo? Ea inventore quisquam, illum alias beatae
          error, fuga neque excepturi vero culpa voluptas nulla qui quasi? Nihil debitis itaque
          aspernatur inventore nobis, aliquid cumque modi dolorem harum ipsum! Esse, autem?
          Explicabo, vel? Sapiente dolorum eum quibusdam! Ipsa in quam natus officiis magni
          veritatis necessitatibus totam, illo temporibus aliquam cum voluptates quos sunt pariatur
          iusto fugiat nihil incidunt ex maxime adipisci? Eligendi, adipisci molestiae alias animi,
          praesentium hic quae ex maiores ipsum cupiditate odio enim autem unde deleniti. Quisquam
          blanditiis cumque nisi molestias autem debitis impedit adipisci iure, voluptatum nemo
          voluptates. Quos quod, explicabo ipsum quibusdam quas iusto dignissimos, eligendi nemo
          repudiandae culpa ipsam vero quidem! Eum, modi molestias quas ex veritatis corrupti, quam,
          omnis nisi ipsa voluptatibus vel repellat iure. Vero nostrum exercitationem quasi
          repudiandae quisquam labore eveniet odit. Deleniti quos corporis et ipsam in incidunt
          eligendi, sapiente amet consequuntur totam quod voluptates dolorum perspiciatis libero
          tempore facere! Laborum, ea! Tempore neque quis, esse ipsum, saepe quae eius laborum
          fugiat nesciunt aspernatur quisquam iure! Harum, aspernatur illum. Ad odit omnis, impedit
          possimus soluta consequuntur quia illo qui reiciendis consectetur? Eveniet? Optio corporis
          laboriosam assumenda, possimus sit ut minus accusantium ipsam error quia repudiandae amet
          deserunt delectus nostrum hic consectetur fuga repellat excepturi vel accusamus nisi et id
          necessitatibus? Quod, earum? Neque facilis nisi reprehenderit, nobis quos labore excepturi
          id accusamus voluptatibus est esse quae veniam velit odit aut iure quia mollitia rerum
          distinctio consequatur, earum pariatur incidunt! Rerum, ratione voluptas? Magnam eius
          voluptas magni praesentium consectetur vel maiores odit sequi quam. Accusamus quisquam
          ducimus, autem officia cupiditate quia at facilis, magnam quod deleniti adipisci rem
          totam, dolorum explicabo esse! Quis. Nihil nemo sequi officia magni ex aliquam laborum
          consectetur quibusdam, eum temporibus voluptatum tenetur amet eveniet accusamus quaerat,
          soluta, error delectus magnam reprehenderit dignissimos explicabo optio quas placeat.
          Accusantium, unde? Rem ipsum hic sed architecto reprehenderit consequuntur enim
          dignissimos necessitatibus neque, quibusdam odit quasi, eligendi expedita reiciendis
          dolore eum quaerat nobis vel tenetur suscipit. Labore eveniet sint dolorem accusantium
          dolores! Sint, modi quaerat debitis nesciunt eius labore veritatis quae quos est animi
          voluptatem, quasi beatae. Itaque ut vel quisquam recusandae voluptatibus, omnis voluptates
          neque iusto error expedita aliquam aliquid provident! Nesciunt reprehenderit rem
          laboriosam dolorum eaque necessitatibus aliquid magnam earum atque hic, voluptates
          molestias possimus, maxime nisi expedita illum consectetur suscipit accusamus doloribus
          sapiente provident ducimus, amet quisquam. Adipisci, ratione! Atque voluptates impedit
          quae necessitatibus similique. Voluptate quos eveniet ducimus incidunt hic assumenda et
          perspiciatis, laborum iste ea cumque at! Eius nulla voluptates aperiam consequuntur maxime
          nesciunt nostrum quos debitis! Explicabo accusamus consequuntur animi pariatur? Corrupti,
          quam natus sed fugiat voluptate cumque exercitationem amet rem similique voluptatibus eos
          magni fugit, voluptatem inventore a, ex molestias odio! Similique distinctio sunt
          possimus. Optio, facere eligendi hic ratione necessitatibus voluptas. Commodi rem fugiat
          libero. Saepe animi optio, in eum ducimus perspiciatis labore voluptas quo. Labore omnis
          sint ab enim numquam animi exercitationem et. Obcaecati iure, aspernatur maiores beatae
          amet fuga, laudantium dolores tempore esse commodi inventore consectetur labore rem.
          Commodi sit, veritatis consectetur blanditiis aut ducimus, suscipit iusto eligendi,
          delectus incidunt quasi dolorem. Ut sunt nisi eos porro aliquid repellendus, delectus
          aspernatur sed excepturi harum inventore omnis nulla laborum officiis voluptatum pariatur
          sapiente impedit. Cupiditate numquam facilis incidunt! Modi id aliquam ab necessitatibus.
          Impedit iusto eum voluptatibus culpa architecto atque cupiditate doloremque. Excepturi
          quasi dolorem voluptatem voluptate numquam magnam sint iste aperiam voluptatibus. Dolores
          doloribus repellendus sit, soluta quisquam voluptatem officiis aliquam nobis. Eius sit
          dignissimos voluptatibus doloribus asperiores nemo sint quos, in quas ea voluptatum error
          iure adipisci facilis quasi minima alias ipsa iste, culpa, quo ex! Qui asperiores
          exercitationem deleniti vel? At commodi, sint perferendis quo aliquam vel deleniti
          laboriosam dignissimos doloribus expedita animi laborum distinctio dolorem obcaecati
          corporis aliquid adipisci eveniet pariatur cum ab deserunt error sunt? Rem, aspernatur
          error. Et quas aspernatur dolore rem accusantium consequuntur quasi, aperiam laborum
          pariatur error ullam a at ipsam doloribus harum perferendis facilis nihil? Eius, velit?
          Aspernatur laudantium ut consectetur harum itaque. Animi. Dignissimos blanditiis veritatis
          quaerat animi laboriosam itaque porro molestiae suscipit fuga magni sunt a, provident
          dolorum sit nam iure recusandae impedit ex mollitia numquam eius aspernatur deserunt
          doloremque reprehenderit. Voluptate. Porro, perspiciatis fugit non nisi rerum architecto
          est aliquam earum laboriosam consequuntur laborum deserunt itaque aperiam assumenda.
          Magnam consequatur dignissimos maxime doloribus eos, illum eveniet similique? Fuga dolorum
          earum possimus? Error nesciunt dolor quos tempora eaque, omnis voluptatum ullam eos ab
          eius. Odit magnam fugiat esse id quae natus exercitationem enim adipisci aspernatur! Neque
          nisi sapiente natus deserunt itaque! Consequuntur! Sunt at explicabo error officiis
          praesentium! Quibusdam suscipit tenetur, omnis ad at iusto delectus esse dicta voluptates
          architecto labore quam quasi. Enim exercitationem consequuntur blanditiis inventore a
          neque ex cum? Nemo, ab reiciendis voluptatum a magnam neque aperiam, vitae recusandae
          asperiores fugiat natus laboriosam unde ipsam molestias iure atque, voluptate quibusdam
          cum ad quasi maxime at. Architecto, veniam exercitationem? Inventore. Maiores consequuntur
          commodi distinctio et reiciendis deleniti voluptas odit architecto consequatur facilis
          neque aut laudantium blanditiis, nostrum officiis fuga doloremque tempore labore molestias
          necessitatibus, magnam totam eveniet dignissimos. Perferendis, quas! Ratione odio iusto
          itaque fugit perspiciatis deserunt facilis unde incidunt nostrum officiis nobis neque
          labore quis, illum quaerat temporibus perferendis magni omnis enim nisi impedit dolore!
          Nisi dignissimos molestias distinctio. Repellat sit quae repudiandae, unde dolor facere,
          commodi nobis, earum pariatur ea aliquid! Quae a, quasi perferendis laboriosam saepe sequi
          cupiditate obcaecati culpa doloribus, ad praesentium veniam! Aut, non dolorem! Quia illum
          enim recusandae sequi officia reiciendis sed nostrum iste molestias? Maiores quod quisquam
          repellat suscipit, aspernatur, in eos, facere quae excepturi ut nobis consequuntur et
          commodi neque voluptas cupiditate. Recusandae atque voluptates pariatur, aspernatur optio,
          expedita quam non eos laboriosam ea quaerat molestiae vitae voluptatibus eligendi quidem
          quae vel ipsam iste facilis. Laboriosam pariatur animi consequuntur laudantium, deserunt
          unde. Minima fugit voluptatem iste enim repudiandae dicta. Quam sed at consequuntur
          quisquam minus ut ipsam. Maiores cum harum vitae unde alias velit. Perferendis corrupti
          reiciendis nemo libero, quae sapiente praesentium. Repellendus error quas voluptatibus
          possimus? Nesciunt tenetur itaque eveniet. Accusamus temporibus tempore laboriosam porro
          sit autem provident, numquam, doloremque soluta quaerat rem earum atque nulla nisi
          consequatur quam laudantium facilis! Suscipit laboriosam rem, harum consequatur non velit
          numquam dicta, officia tenetur, voluptatum impedit porro et? Magni ipsum nobis earum
          veritatis, voluptatum dolores magnam, deserunt in, ipsam placeat eaque minus cum. Voluptas
          odit doloribus corrupti blanditiis voluptates consequuntur distinctio cumque nisi, quia
          nobis, fugit consequatur officia ratione quod beatae illum obcaecati natus quisquam
          voluptatem aspernatur. Ex libero expedita voluptatum in ad. Sunt corrupti at culpa
          repudiandae vitae autem quis impedit error odit cum, tenetur, debitis sit enim ex
          consequuntur asperiores, fuga illum tempore obcaecati hic! Repellat fugit amet adipisci
          fuga modi?
        </span>
      </div>

      <button
        className=" col-span-2 col-start-9 mt-2 grid-rows-2 text-xs text-gray-500 "
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? "скрыть" : "показать"}
      </button>
    </div>
  );
};
