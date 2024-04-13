import { Flex, Image, Modal, Pagination } from "antd";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import { PaginatedListProps } from ".";
import { Episode } from "../../../entities/entities";
import { FALLBACK } from "../../Content/constants";
import "./styles";

const PaginatedList = ({
  title,
  data,
  total,
  onChange,
  seasonEpisodes,
}: PaginatedListProps) => {
  const [episodes, setEpisodes] = useState<Episode[] | undefined>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Flex align="center">
        <Title>{title}</Title>
      </Flex>
      <Flex className="paginatedRow">
        {data.map((v, ii) => (
          <div key={ii} className="paginatedCard">
            <Image
              className="paginatedPhoto"
              src={v.photo || ""}
              fallback={FALLBACK}
              preview={!seasonEpisodes}
              style={{ cursor: seasonEpisodes ? "pointer" : undefined }}
              onClick={
                seasonEpisodes
                  ? () => {
                      setEpisodes(v.episodes);
                      setIsModalOpen(true);
                    }
                  : undefined
              }
            />
            <div className="paginatedName">{v.name}</div>
          </div>
        ))}
      </Flex>
      {total > 4 && (
        <Pagination
          defaultCurrent={1}
          pageSize={4}
          total={total}
          onChange={onChange}
          style={{ marginTop: 10 }}
        />
      )}
      {total == 0 && (
        <Flex align="center">
          <Title level={3}>
            Нет информации о {'"'}
            {title}
            {'"'}
          </Title>
        </Flex>
      )}
      {seasonEpisodes && (
        <Modal
          title="Серии"
          open={isModalOpen}
          width={300}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          {episodes?.map((ep, i) => (
            <Flex key={i} align="center" className="episodeBox">
              <div style={{ marginRight: 20 }}>
                <Image
                  className="episodeImage"
                  src={ep.still?.previewUrl || ""}
                />
              </div>
              <div>
                Серия {ep.number}: {ep.name}
              </div>
            </Flex>
          ))}
        </Modal>
      )}
    </>
  );
};

export default PaginatedList;
